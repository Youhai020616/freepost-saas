import { NextRequest, NextResponse } from "next/server";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { createTwitterAuthUrl, persistTwitterState } from "@/lib/twitter";

// GET /api/oauth/:provider/start (call via /api/w/:slug/oauth/:provider/start)
export async function GET(req: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider;
  try {
    const { userId, slug } = await requireSessionAndWorkspace();
    const url = new URL(req.url);
    const returnTo = url.searchParams.get("return_to") || undefined;

    if (provider === 'twitter') {
      const base = `${url.protocol}//${url.host}`;
      const { state, authUrl } = await createTwitterAuthUrl({
        slug,
        userId,
        returnTo,
        redirectUri: `${base}/api/oauth/twitter/callback`,
      });
      // persistTwitterState 已在 createTwitterAuthUrl 内部完成
      return NextResponse.redirect(authUrl, { status: 302 });
    }

    // Fallback: other providers still mock redirect for now
    const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const base = `${url.protocol}//${url.host}`;
    const callback = `${base}/api/oauth/${encodeURIComponent(provider)}/callback?code=mock-code&state=${encodeURIComponent(state)}`;
    return NextResponse.redirect(callback, { status: 302 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
