import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { handleApiError, errors } from "@/lib/errors";
import { validateRequest, validateQuery } from "@/lib/validation";
import { postSchemas } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";

// GET /api/posts - list posts for current workspace
export async function GET(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();

    // Validate query parameters
    const query = validateQuery(req, postSchemas.list);

    logger.info('Fetching posts', { workspaceId, query });

    // Build filter conditions
    const where: any = { workspaceId };
    if (query.status) where.status = query.status;
    if (query.platform) where.platform = query.platform;

    // Optimized query with pagination and field selection
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          content: true,
          platform: true,
          status: true,
          scheduledAt: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          // Don't fetch large JSON fields unless needed
        },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.post.count({ where }),
    ]);

    logger.info('Posts fetched successfully', {
      workspaceId,
      count: posts.length,
      total
    });

    return NextResponse.json({
      data: posts,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/posts - create a post
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();

    // Validate request body
    const data = await validateRequest(req, postSchemas.create);

    logger.info('Creating post', { workspaceId, platform: data.platform });

    // Create post with validated data
    const post = await prisma.post.create({
      data: {
        workspaceId,
        content: data.content,
        platform: data.platform ?? null,
        targetAccounts: data.targetAccounts ?? null,
        mediaIds: data.mediaIds ?? null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        status: data.scheduledAt ? "SCHEDULED" : "DRAFT",
      },
    });

    logger.info('Post created successfully', {
      postId: post.id,
      status: post.status,
      scheduledAt: post.scheduledAt
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
