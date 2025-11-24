import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { handleApiError, errors } from "@/lib/errors";
import { validateRequest, validateParams } from "@/lib/validation";
import { postSchemas, patterns } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";
import { z } from "zod";

const paramsSchema = z.object({ id: patterns.cuid });

// GET /api/posts/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = validateParams(await params, paramsSchema);

    logger.debug('Fetching post', { postId: id, workspaceId });

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        platform: true,
        status: true,
        scheduledAt: true,
        publishedAt: true,
        externalId: true,
        targetAccounts: true,
        mediaIds: true,
        variants: true,
        createdAt: true,
        updatedAt: true,
        workspaceId: true,
      }
    });

    if (!post || post.workspaceId !== workspaceId) {
      throw errors.notFound('Post', id);
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/posts/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = validateParams(await params, paramsSchema);

    // Validate request body
    const data = await validateRequest(req, postSchemas.update);

    logger.info('Updating post', { postId: id, workspaceId });

    // Check if post exists and belongs to workspace
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.workspaceId !== workspaceId) {
      throw errors.notFound('Post', id);
    }

    // Additional validation for scheduled posts
    if (data.scheduledAt) {
      const scheduledDate = new Date(data.scheduledAt);

      // Only validate future time for non-published posts
      if (existing.status !== "PUBLISHED" && scheduledDate < new Date()) {
        throw errors.badRequest('Scheduled time must be in the future');
      }
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      }
    });

    logger.info('Post updated successfully', {
      postId: id,
      status: post.status
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/posts/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = validateParams(await params, paramsSchema);

    logger.info('Deleting post', { postId: id, workspaceId });

    // Check if post exists and belongs to workspace
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.workspaceId !== workspaceId) {
      throw errors.notFound('Post', id);
    }

    // Delete post and related scheduler jobs in a transaction
    await prisma.$transaction([
      prisma.schedulerJob.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } }),
    ]);

    logger.info('Post deleted successfully', { postId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
