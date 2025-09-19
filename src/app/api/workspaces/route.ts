import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// GET /api/workspaces - list workspaces for current user
export async function GET(_req: NextRequest) {
  try {
    const { userId } = await requireSessionAndWorkspace();
    const memberships = await prisma.membership.findMany({ where: { userId }, include: { workspace: true } });
    return NextResponse.json({ data: memberships.map(m => m.workspace) });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

// POST /api/workspaces - create workspace owned by current user
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireSessionAndWorkspace();
    const body = await req.json();
    const { slug, plan } = body ?? {};
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const ws = await prisma.workspace.create({
      data: {
        slug,
        ownerId: userId,
        plan: plan ?? "free",
        members: { create: [{ userId, role: "owner" }] },
      },
    });
    return NextResponse.json({ data: ws }, { status: 201 });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
