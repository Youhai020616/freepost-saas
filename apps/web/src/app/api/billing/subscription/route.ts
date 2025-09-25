import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/billing/subscription?workspaceId=...
export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
  const sub = await prisma.subscription.findUnique({ where: { workspaceId } });
  return NextResponse.json({ data: sub });
}
