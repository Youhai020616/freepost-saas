"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Server Action helper: ensure user session and default workspace
export async function ensureOnboarded() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const userId = session.user.id;

  // ensure a User record exists in Prisma (if you map BetterAuth user to DB)
  // Here we upsert by email if available
  const email = session.user.email ?? undefined;
  const user = await prisma.user.upsert({
    where: email ? { email } : { id: userId },
    update: {},
    create: { id: userId, email: email ?? `${userId}@placeholder.local` },
  });

  // find or create default workspace
  let membership = await prisma.membership.findFirst({ where: { userId: user.id } });
  let slug: string | null = null;
  if (!membership) {
    slug = `ws-${user.id.slice(0, 8)}`;
    const ws = await prisma.workspace.create({
      data: {
        slug,
        ownerId: user.id,
        plan: "free",
        members: { create: [{ userId: user.id, role: "owner" }] },
      },
    });
    membership = { userId: user.id, workspaceId: ws.id, role: "owner" };
  }

  if (!slug) {
    // resolve slug from membership.workspaceId
    const ws = await prisma.workspace.findUnique({ where: { id: membership!.workspaceId } });
    slug = ws?.slug ?? "";
  }

  return { userId: user.id, workspaceId: membership!.workspaceId, slug };
}
