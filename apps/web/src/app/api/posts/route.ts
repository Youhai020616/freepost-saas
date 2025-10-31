import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// GET /api/posts - list posts for current workspace (use /api/w/:slug/posts)
export async function GET() {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const list = await prisma.post.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: list });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : message === "workspace_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/posts - create a post
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const body = await req.json();
    const { content, targetAccounts, mediaIds, scheduledAt } = body ?? {};
    if (!content) return NextResponse.json({ error: "content required" }, { status: 400 });

    const post = await prisma.post.create({
      data: {
        workspaceId,
        content,
        targetAccounts: targetAccounts ?? null,
        mediaIds: mediaIds ?? null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? "SCHEDULED" : "DRAFT",
      },
    });
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : message === "workspace_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
