import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// POST /api/posts/schedule
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const body = await req.json();
    const { postId, runAt, cron } = body ?? {};
    if (!(postId && (runAt || cron))) {
      return NextResponse.json({ error: "(postId + runAt|cron) required" }, { status: 400 });
    }

    const existing = await prisma.post.findUnique({ where: { id: postId } });
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const job = await prisma.schedulerJob.create({
      data: {
        workspaceId,
        postId,
        runAt: runAt ? new Date(runAt) : null,
        cron: cron ?? null,
        status: "QUEUED",
      },
    });

    return NextResponse.json({ data: job }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : message === "workspace_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
