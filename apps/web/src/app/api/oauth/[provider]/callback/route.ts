import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { consumeTwitterState, exchangeTwitterToken, getTwitterUser, upsertTwitterAccount } from "@/lib/twitter";

// GET /api/oauth/:provider/callback (call via /api/w/:slug/oauth/:provider/callback)
export async function GET(req: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider;
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!state) return NextResponse.json({ error: "missing_state" }, { status: 400 });

  try {
    if (provider === 'twitter') {
      const saved = await consumeTwitterState(state);
      if (!saved) return NextResponse.json({ error: "invalid_state" }, { status: 400 });
      const { slug, userId, returnTo, code_verifier, redirect_uri } = saved;

      const ctx = await requireSessionAndWorkspace();
      if (ctx.userId !== userId) return NextResponse.json({ error: "user_mismatch" }, { status: 400 });

      // Exchange code for tokens
      if (!code) return NextResponse.json({ error: "missing_code" }, { status: 400 });
      const tokens = await exchangeTwitterToken({ code, code_verifier, redirect_uri });

      // Fetch user info to get external id
      const me = await getTwitterUser(tokens.access_token);
      const externalId = `twitter:${me.data.id}`;

      // Upsert social account
      await upsertTwitterAccount({
        workspaceId: ctx.workspaceId,
        externalId,
        tokens,
      });

      return NextResponse.redirect(returnTo || `/w/${slug}`, { status: 302 });
    }

    // Fallback mock for other providers
    const ctx = await requireSessionAndWorkspace();
    const ws = await prisma.workspace.findUnique({ where: { id: ctx.workspaceId } });
    if (!ws) return NextResponse.json({ error: "workspace_not_found" }, { status: 404 });
    const slug = url.searchParams.get('slug') || 'default';
    await prisma.socialAccount.create({
      data: {
        workspaceId: ws.id,
        provider,
        externalId: `${provider}:${ctx.userId}`,
        accessToken: 'mock',
        refreshToken: null,
        meta: { provider, code, createdAt: new Date().toISOString() } as any,
      },
    });
    return NextResponse.redirect(`/w/${slug}`, { status: 302 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
