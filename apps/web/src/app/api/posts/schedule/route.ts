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

    await prisma.post.update({ where: { id: postId }, data: { status: "SCHEDULED", scheduledAt: runAt ? new Date(runAt) : null } });

    return NextResponse.json({ data: job }, { status: 201 });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
