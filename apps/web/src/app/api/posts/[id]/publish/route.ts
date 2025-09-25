import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// POST /api/posts/[id]/publish - mock immediate publish
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = await params;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // TODO: call provider adapters to publish
    await prisma.post.update({ where: { id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
