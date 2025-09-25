import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// GET /api/posts - list posts for current workspace
export async function GET(_req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const posts = await prisma.post.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: posts });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

// POST /api/posts - create draft post
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
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
