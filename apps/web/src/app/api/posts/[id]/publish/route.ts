import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// POST /api/posts/:id/publish
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = params;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.post.update({ where: { id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : message === "workspace_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
