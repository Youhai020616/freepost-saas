import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { getValidTwitterAccessToken, postTweet } from "@/lib/twitter";
import { handleApiError, errors } from "@/lib/errors";
import { validateParams } from "@/lib/validation";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { patterns } from "@/lib/validation/schemas";

const paramsSchema = z.object({ id: patterns.cuid });

// POST /api/posts/:id/publish
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = validateParams(await params, paramsSchema);

    // Rate limiting (5 publishes per minute)
    const identifier = `publish:${workspaceId}`;
    const { success, remaining } = await rateLimit(identifier, 'publish');

    if (!success) {
      logger.warn('Rate limit exceeded for publish', { workspaceId });
      return NextResponse.json(
        { error: 'Too many publish requests. Please try again later.' },
        {
          status: 429,
          headers: { 'X-RateLimit-Remaining': remaining.toString() }
        }
      );
    }

    logger.info('Publishing post', { postId: id, workspaceId });

    // Atomic check-and-update to prevent race conditions
    // First, try to claim the post for publishing by atomically updating status
    // CRITICAL: Only allow DRAFT posts to be claimed - this prevents race conditions
    // where two concurrent requests could both claim a SCHEDULED post
    const claimResult = await prisma.post.updateMany({
      where: {
        id,
        workspaceId,
        status: 'DRAFT'  // Only claim if still in DRAFT state (prevents race conditions)
      },
      data: {
        status: 'SCHEDULED'  // Temporarily mark as SCHEDULED to prevent concurrent publishes
      }
    });

    if (claimResult.count === 0) {
      // Either post doesn't exist, wrong workspace, or already published
      const existing = await prisma.post.findUnique({ 
        where: { id },
        select: { workspaceId: true, status: true }
      });
      
      if (!existing || existing.workspaceId !== workspaceId) {
        throw errors.notFound('Post', id);
      }
      
      if (existing.status === 'PUBLISHED') {
        throw errors.badRequest('Post is already published');
      }
      
      throw errors.badRequest('Post cannot be published in current state');
    }

    // Fetch the full post for publishing
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw errors.notFound('Post', id);
    }

    // Platform-specific publishing
    let externalId: string | undefined;
    let publishError: string | undefined;

    try {
      if (existing.platform === "twitter") {
        logger.debug('Publishing to Twitter', { postId: id });

        // Get workspace's Twitter account
        const socialAccount = await prisma.socialAccount.findFirst({
          where: { workspaceId, provider: "twitter" },
        });

        if (!socialAccount) {
          throw errors.badRequest(
            'No Twitter account connected to this workspace',
            { provider: 'twitter' }
          );
        }

        // Get valid access token (auto-refresh if needed)
        const accessToken = await getValidTwitterAccessToken(socialAccount.id);

        // Publish tweet
        const result = await postTweet(accessToken, existing.content);
        externalId = result.data?.id;

        logger.info('Published to Twitter successfully', {
          postId: id,
          tweetId: externalId
        });
      } else if (existing.platform) {
        // Other platforms not yet implemented
        throw errors.badRequest(
          `Publishing to ${existing.platform} is not yet implemented`,
          { platform: existing.platform }
        );
      } else {
        throw errors.badRequest('Post platform is not specified');
      }
    } catch (publishErr: unknown) {
      // Capture publishing error
      publishError = publishErr instanceof Error ? publishErr.message : String(publishErr);
      logger.error('Failed to publish post', {
        postId: id,
        platform: existing.platform,
        error: publishError,
      });
    }

    // Update post status atomically
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        status: publishError ? "FAILED" : "PUBLISHED",
        publishedAt: publishError ? null : new Date(),
        externalId: externalId ?? null,
      }
    });

    if (publishError) {
      return NextResponse.json({
        success: false,
        error: "publish_failed",
        message: publishError,
        post: updatedPost,
      }, { status: 500 });
    }

    logger.info('Post published successfully', {
      postId: id,
      externalId,
      platform: existing.platform
    });

    return NextResponse.json({
      success: true,
      externalId,
      post: updatedPost,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
