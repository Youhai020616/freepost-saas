import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// GET /api/posts/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: post });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : message === "workspace_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/posts/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = params;
    const body = await req.json();
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Validate scheduledTime if provided
    if (body.scheduledTime !== undefined) {
      const scheduledDate = new Date(body.scheduledTime);
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json({ error: "Invalid scheduledTime format" }, { status: 400 });
      }
      // Ensure scheduledTime is in the future (optional validation)
      if (scheduledDate < new Date()) {
        return NextResponse.json({ error: "scheduledTime must be in the future" }, { status: 400 });
      }
    }

    const post = await prisma.post.update({ where: { id }, data: body });
    return NextResponse.json({ data: post });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : message === "workspace_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/posts/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const { id } = params;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : message === "workspace_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
