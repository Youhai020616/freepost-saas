import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureOnboarded } from "@/lib/onboarding";

// POST /api/auth/sign-in
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};
    if (!email || !password) return NextResponse.json({ error: "email and password required" }, { status: 400 });

    await auth.api.signInEmail({
      body: { email, password },
    });

    const ctx = await ensureOnboarded();
    return NextResponse.json({ success: true, slug: ctx?.slug });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 400 });
  }
}
