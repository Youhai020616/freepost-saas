import { NextResponse } from "next/server";
import { ensureOnboarded } from "@/lib/onboarding";

// POST /api/onboarding/ensure
export async function POST() {
  const ctx = await ensureOnboarded();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ data: ctx });
}
