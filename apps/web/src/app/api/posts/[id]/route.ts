import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// GET /api/posts/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: post });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

// PATCH /api/posts/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const body = await req.json();
    const { id } = await params;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const post = await prisma.post.update({ where: { id }, data: body });
    return NextResponse.json({ data: post });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

// DELETE /api/posts/[id]
export async function DELETE(
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
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
