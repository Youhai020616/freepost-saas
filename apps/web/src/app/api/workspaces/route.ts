import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { handleApiError, errors } from "@/lib/errors";
import { validateRequest } from "@/lib/validation";
import { workspaceSchemas } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";

// GET /api/workspaces - list workspaces for current user
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw errors.unauthorized();
    }

    logger.info('Fetching workspaces', { userId: session.user.id });

    // Optimized query - only fetch needed fields
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      select: {
        workspace: {
          select: {
            id: true,
            slug: true,
            plan: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        role: true,
      },
      orderBy: {
        workspace: {
          createdAt: 'desc',
        },
      },
    });

    const workspaces = memberships.map((m) => ({
      ...m.workspace,
      userRole: m.role,
    }));

    logger.info('Workspaces fetched', {
      userId: session.user.id,
      count: workspaces.length
    });

    return NextResponse.json({ data: workspaces });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/workspaces - create workspace owned by current user
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw errors.unauthorized();
    }

    // Validate request body with Zod schema
    const data = await validateRequest(req, workspaceSchemas.create);

    logger.info('Creating workspace', {
      userId: session.user.id,
      slug: data.slug
    });

    // Check if slug already exists
    const existing = await prisma.workspace.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      throw errors.conflict(
        'A workspace with this slug already exists',
        { slug: data.slug }
      );
    }

    // Create workspace with membership in a transaction
    const workspace = await prisma.workspace.create({
      data: {
        slug: data.slug,
        ownerId: session.user.id,
        plan: "free",
        members: {
          create: [{
            userId: session.user.id,
            role: "owner"
          }]
        },
      },
    });

    logger.info('Workspace created successfully', {
      workspaceId: workspace.id,
      slug: workspace.slug,
      ownerId: session.user.id
    });

    return NextResponse.json({ data: workspace }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
