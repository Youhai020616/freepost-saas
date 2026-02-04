import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import {
  consumeTwitterState,
  exchangeTwitterToken,
  getTwitterUser,
  upsertTwitterAccount
} from "@/lib/twitter";
import { validateParams, validateQuery } from "@/lib/validation";
import { oauthSchemas } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";
import { handleApiError, errors } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

/**
 * Validate returnTo URL to prevent open redirect attacks
 * Only allows relative paths or same-origin URLs
 */
function validateReturnTo(returnTo: string | undefined): string | undefined {
  if (!returnTo) return undefined;

  // Allow relative paths (but not protocol-relative //evil.com)
  if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
    return returnTo;
  }

  // Validate same-origin for absolute URLs
  try {
    const targetUrl = new URL(returnTo);
    const appUrl = new URL(env.APP_URL);
    if (targetUrl.origin === appUrl.origin) {
      return returnTo;
    }
  } catch {
    // Invalid URL format - reject
  }

  logger.warn('Rejected invalid returnTo URL in OAuth callback', { returnTo });
  return undefined;
}

/**
 * GET /api/oauth/:provider/callback
 * Handle OAuth callback from social media provider
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    // Rate limiting (3 requests per minute for OAuth)
    const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
    const { success, remaining } = await rateLimit(identifier, 'oauth');

    if (!success) {
      logger.warn('Rate limit exceeded for OAuth callback', { identifier });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'X-RateLimit-Remaining': remaining.toString() }
        }
      );
    }

    // Validate provider parameter
    const { provider } = validateParams(await params, oauthSchemas.params);

    // Parse URL query parameters
    const url = new URL(req.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    // Check for OAuth errors
    if (error) {
      logger.warn('OAuth error from provider', { provider, error });
      throw errors.badRequest(`OAuth error: ${error}`, { provider, error });
    }

    // Validate required state parameter
    if (!state) {
      throw errors.badRequest('Missing state parameter', { provider });
    }

    logger.info('OAuth callback received', { provider, hasCode: !!code });

    // Handle Twitter OAuth
    if (provider === 'twitter') {
      // Consume and validate state
      const saved = await consumeTwitterState(state);
      if (!saved) {
        throw errors.badRequest('Invalid or expired state', { provider });
      }

      const { slug, userId, returnTo, code_verifier, redirect_uri } = saved;

      // Verify session matches state
      const ctx = await requireSessionAndWorkspace();
      if (ctx.userId !== userId) {
        throw errors.unauthorized('User mismatch');
      }

      // Verify workspace from state matches authenticated workspace
      const stateWorkspace = await prisma.workspace.findUnique({
        where: { slug },
        select: { id: true, slug: true },
      });

      if (!stateWorkspace) {
        throw errors.notFound('Workspace', slug);
      }

      // Critical: Ensure OAuth state workspace matches current authenticated workspace
      if (stateWorkspace.id !== ctx.workspaceId) {
        logger.warn('OAuth workspace mismatch', {
          stateWorkspace: stateWorkspace.id,
          authenticatedWorkspace: ctx.workspaceId,
          userId
        });
        throw errors.forbidden('Workspace mismatch - OAuth initiated for different workspace');
      }

      // Exchange authorization code for tokens
      if (!code) {
        throw errors.badRequest('Missing authorization code', { provider });
      }

      logger.info('Exchanging Twitter code for tokens', { userId });
      const tokens = await exchangeTwitterToken({
        code,
        code_verifier,
        redirect_uri
      });

      // Fetch Twitter user info
      const me = await getTwitterUser(tokens.access_token);
      const externalId = `twitter:${me.data.id}`;

      logger.info('Twitter user authenticated', {
        externalId,
        username: me.data.username
      });

      // Upsert social account
      await upsertTwitterAccount({
        workspaceId: ctx.workspaceId,
        externalId,
        tokens,
      });

      logger.info('Twitter account connected', {
        workspaceId: ctx.workspaceId,
        externalId
      });

      // Redirect back to app - SECURITY: validate returnTo to prevent open redirect
      const safeReturnTo = validateReturnTo(returnTo);
      const redirectUrl = safeReturnTo || `/w/${slug}`;
      return NextResponse.redirect(new URL(redirectUrl, env.APP_URL), { status: 302 });
    }

    // Unsupported provider
    logger.warn('Unsupported OAuth provider callback', { provider });
    throw errors.badRequest(
      `OAuth provider '${provider}' is not yet implemented. Supported: twitter`,
      { provider, supported: ['twitter'] }
    );
  } catch (error) {
    logger.error('OAuth callback failed', { error });
    return handleApiError(error);
  }
}
