import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type RequestContext = {
  userId: string;
  workspaceId: string;
};

export async function requireSessionAndWorkspace(): Promise<RequestContext> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("unauthorized");

  const slug = (await headers()).get("x-workspace-slug");

  // Prefer slug from middleware; otherwise, fallback to first membership
  let workspaceId: string;
  if (slug) {
    const ws = await prisma.workspace.findUnique({ where: { slug } });
    if (!ws) throw new Error("workspace_not_found");
    const membership = await prisma.membership.findUnique({
      where: { userId_workspaceId: { userId: session.user.id, workspaceId: ws.id } },
    });
    if (!membership) throw new Error("forbidden");
    workspaceId = ws.id;
  } else {
    const m = await prisma.membership.findFirst({ where: { userId: session.user.id } });
    if (!m) throw new Error("no_workspace");
    workspaceId = m.workspaceId;
  }

  return { userId: session.user.id, workspaceId };
}
