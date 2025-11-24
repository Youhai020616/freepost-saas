import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/errors";
import { getValidTwitterAccessToken, postTweet } from "@/lib/twitter";

// POST /api/cron/publish - invoked by Vercel Cron
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized cron request');
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

        // Mark as completed
        await prisma.$transaction([
          prisma.schedulerJob.update({
            where: { id: job.id },
            data: { status: "DONE" },
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
