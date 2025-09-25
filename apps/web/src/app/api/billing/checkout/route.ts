import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/billing/checkout - mock checkout session
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { workspaceId, plan } = body ?? {};
  if (!workspaceId || !plan) return NextResponse.json({ error: "workspaceId and plan required" }, { status: 400 });

  // Mock: create/update subscription immediately
  await prisma.subscription.upsert({
    where: { workspaceId },
    update: { plan, status: "active", currentPeriodEnd: new Date(Date.now() + 30*24*3600*1000) },
    create: { workspaceId, plan, status: "active", currentPeriodEnd: new Date(Date.now() + 30*24*3600*1000) },
  });

  return NextResponse.json({ url: "/billing/success" });
}
