import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/workspaces - list workspaces for current user
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      include: { workspace: true } as any,
    });
    return NextResponse.json({ data: memberships.map((m: any) => m.workspace) });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// POST /api/workspaces - create workspace owned by current user
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const body = await req.json();
    const { slug, plan } = body ?? {};
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const ws = await prisma.workspace.create({
      data: {
        slug,
        ownerId: session.user.id,
        plan: plan ?? "free",
        members: { create: [{ userId: session.user.id, role: "owner" }] },
      },
    });
    return NextResponse.json({ data: ws }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
