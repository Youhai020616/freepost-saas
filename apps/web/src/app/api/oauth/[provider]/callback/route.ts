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

      // Verify workspace exists
      const workspace = await prisma.workspace.findUnique({
        where: { id: ctx.workspaceId },
        select: { id: true, slug: true },
      });

      if (!workspace) {
        throw errors.notFound('Workspace', ctx.workspaceId);
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

      // Redirect back to app
      const redirectUrl = returnTo || `/w/${slug}`;
      return NextResponse.redirect(redirectUrl, { status: 302 });
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
