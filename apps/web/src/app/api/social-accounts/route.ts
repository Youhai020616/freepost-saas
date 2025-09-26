import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// POST /api/social-accounts - create a social account record (after oauth)
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const body = await req.json();
    const { provider, externalId, accessToken, refreshToken, meta } = body ?? {};
    if (!provider || !externalId || !accessToken) {
      return NextResponse.json({ error: "provider, externalId, accessToken required" }, { status: 400 });
    }
    const acc = await prisma.socialAccount.create({
      data: {
        workspaceId,
        provider,
        externalId,
        accessToken,
        refreshToken: refreshToken ?? null,
        meta: meta ?? null,
      },
    });
    return NextResponse.json({ data: acc }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

// GET /api/social-accounts
export async function GET() {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const list = await prisma.socialAccount.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ data: list });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === "unauthorized" ? 401 : message === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
