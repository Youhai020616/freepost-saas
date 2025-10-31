import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { getValidTwitterAccessToken, postTweet } from "@/lib/twitter";

// POST /api/providers/twitter/tweet  (call via /api/w/:slug/providers/twitter/tweet)
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const body = await req.json();
    const { content, socialAccountId } = body ?? {};
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'content required' }, { status: 400 });
    }

    // Pick account
    let account = null as null | { id: string };
    if (socialAccountId) {
      account = await prisma.socialAccount.findFirst({ where: { id: socialAccountId, workspaceId, provider: 'twitter' }, select: { id: true } });
    } else {
      account = await prisma.socialAccount.findFirst({ where: { workspaceId, provider: 'twitter' }, orderBy: { createdAt: 'desc' }, select: { id: true } });
    }
    if (!account) return NextResponse.json({ error: 'no_twitter_account' }, { status: 400 });

    const accessToken = await getValidTwitterAccessToken(account.id);
    const result = await postTweet(accessToken, content);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const status = message === 'unauthorized' ? 401 : message === 'forbidden' ? 403 : message === 'workspace_not_found' ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
