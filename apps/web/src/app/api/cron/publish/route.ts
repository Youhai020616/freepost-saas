import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/errors";
import { getValidTwitterAccessToken, postTweet } from "@/lib/twitter";
import { secureCompare } from "@/lib/crypto";
import { env } from "@/lib/env";

// POST /api/cron/publish - invoked by Vercel Cron
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret for security - FAIL CLOSED
    const authHeader = req.headers.get('authorization');
    // Use validated env module instead of direct process.env access
    const cronSecret = env.CRON_SECRET;

    // Security: Require CRON_SECRET to be configured
    if (!cronSecret) {
      logger.error('CRON_SECRET not configured - cron endpoint disabled');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Use constant-time comparison to prevent timing attacks
    const expectedAuth = `Bearer ${cronSecret}`;
    if (!authHeader || !secureCompare(authHeader, expectedAuth)) {
      logger.warn('Unauthorized cron request', {
        hasAuth: !!authHeader,
        ip: req.headers.get('x-forwarded-for') || 'unknown'
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Running scheduled publish cron job');

    // Find due jobs
    const now = new Date();
    const dueJobs = await prisma.schedulerJob.findMany({
      where: {
        status: "QUEUED",
        runAt: { lte: now },
      },
      include: {
        post: true,
        workspace: true,
      },
      take: 20,
      orderBy: { runAt: 'asc' },
    });

    logger.info('Found due jobs', { count: dueJobs.length });

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
    };

    for (const job of dueJobs) {
      // CRITICAL: Atomic claim to prevent race conditions when multiple instances run
      // Use updateMany to atomically claim the job by changing status to RUNNING
      const claimResult = await prisma.schedulerJob.updateMany({
        where: {
          id: job.id,
          status: "QUEUED"  // Only claim if still QUEUED
        },
        data: {
          status: "RUNNING"
        }
      });

      // If count === 0, another instance already claimed this job - skip it
      if (claimResult.count === 0) {
        logger.debug('Job already claimed by another instance', { jobId: job.id });
        continue;
      }

      results.processed++;

      try {
        logger.info('Processing scheduled job', {
          jobId: job.id,
          postId: job.postId,
          platform: job.post.platform
        });

        let externalId: string | undefined;

        // Platform-specific publishing
        if (job.post.platform === 'twitter') {
          // Get social account for this workspace
          const socialAccount = await prisma.socialAccount.findFirst({
            where: {
              workspaceId: job.workspaceId,
              provider: 'twitter',
            },
          });

          if (!socialAccount) {
            throw new Error('No Twitter account connected');
          }

          // Get valid access token
          const accessToken = await getValidTwitterAccessToken(socialAccount.id);

          // Publish tweet
          const result = await postTweet(accessToken, job.post.content);
          externalId = result.data?.id;
        } else {
          logger.warn('Unsupported platform for scheduled publishing', {
            platform: job.post.platform
          });
          throw new Error(`Platform ${job.post.platform} not supported`);
        }

        // Mark as completed (already RUNNING, now mark as DONE)
        await prisma.$transaction([
          prisma.schedulerJob.update({
            where: { id: job.id },
            data: { status: "DONE", lastError: null },
          }),
          prisma.post.update({
            where: { id: job.postId },
            data: {
              status: "PUBLISHED",
              publishedAt: new Date(),
              externalId: externalId ?? null,
            },
          }),
        ]);

        results.succeeded++;
        logger.info('Job completed successfully', {
          jobId: job.id,
          postId: job.postId,
          externalId
        });
      } catch (error: unknown) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : String(error);

        logger.error('Job failed', {
          jobId: job.id,
          postId: job.postId,
          error: errorMessage,
        });

        // Mark job as failed
        await prisma.$transaction([
          prisma.schedulerJob.update({
            where: { id: job.id },
            data: {
              status: "FAILED",
              lastError: errorMessage,
            },
          }),
          prisma.post.update({
            where: { id: job.postId },
            data: { status: "FAILED" },
          }),
        ]);
      }
    }

    logger.info('Cron job completed', results);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
