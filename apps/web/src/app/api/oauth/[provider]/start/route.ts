import { NextRequest, NextResponse } from "next/server";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { createTwitterAuthUrl } from "@/lib/twitter";
import { prisma } from "@/lib/db";
import { validateParams, validateQuery } from "@/lib/validation";
import { oauthSchemas } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";
import { handleApiError, errors } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

/**
 * GET /api/oauth/:provider/start
 * Initiate OAuth flow for social media provider
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
      logger.warn('Rate limit exceeded for OAuth start', { identifier });
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

    // Validate query parameters
    const url = new URL(req.url);
    const returnTo = url.searchParams.get("return_to") || undefined;

    // Require authenticated user and workspace
    const { userId, workspaceId } = await requireSessionAndWorkspace();

    logger.info('OAuth flow started', { provider, userId, workspaceId });

    // Get workspace to obtain slug
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { slug: true },
    });

    if (!workspace) {
      throw errors.notFound('Workspace', workspaceId);
    }

    // Handle Twitter OAuth
    if (provider === 'twitter') {
      const base = `${url.protocol}//${url.host}`;
      const { authUrl } = await createTwitterAuthUrl({
        slug: workspace.slug,
        userId,
        returnTo,
        redirectUri: `${base}/api/oauth/twitter/callback`,
      });

      logger.info('Redirecting to Twitter OAuth', { userId, workspaceId });
      return NextResponse.redirect(authUrl, { status: 302 });
    }

    // Unsupported provider
    logger.warn('Unsupported OAuth provider', { provider });
    throw errors.badRequest(
      `OAuth provider '${provider}' is not yet implemented. Supported: twitter`,
      { provider, supported: ['twitter'] }
    );
  } catch (error) {
    logger.error('OAuth start failed', { error });
    return handleApiError(error);
  }
}
