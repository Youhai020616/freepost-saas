import { NextRequest, NextResponse } from "next/server";
import { ensureOnboarded } from "@/lib/onboarding";

// POST /api/onboarding/ensure
export async function POST(_req: NextRequest) {
  const ctx = await ensureOnboarded();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ data: ctx });
}
