import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/cron/publish - invoked by Vercel Cron
export async function POST() {
  // find due jobs
  const now = new Date();
  const due = await prisma.schedulerJob.findMany({
    where: {
      status: "QUEUED",
      OR: [
        { runAt: { lte: now } },
        { cron: { not: null } }, // cron handling (simple placeholder)
      ],
    },
    take: 20,
  });

  for (const job of due) {
    try {
      // TODO: call provider adapters to publish. For now, mock publish.
      await prisma.schedulerJob.update({ where: { id: job.id }, data: { status: "DONE" } });
      await prisma.post.update({ where: { id: job.postId }, data: { status: "PUBLISHED", publishedAt: new Date() } });
    } catch (e: any) {
      await prisma.schedulerJob.update({ where: { id: job.id }, data: { status: "FAILED", lastError: String(e?.message || e) } });
    }
  }

  return NextResponse.json({ processed: due.length });
}
