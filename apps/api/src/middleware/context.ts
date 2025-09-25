import type { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

// Lazy prisma to avoid depending on workspace package build during API compile
const prisma = new PrismaClient({ log: ['error', 'warn'] })

export type RequestContext = {
  userId: string
  workspaceId: string
  slug: string
}

export async function requireSessionAndWorkspace(c: Context): Promise<RequestContext> {
  const slug = c.req.param('slug')
  if (!slug) throw new Error('workspace_slug_required')

  const userId = c.req.header('x-user-id')
  if (!userId) throw new Error('unauthorized')

  const ws = await prisma.workspace.findUnique({ where: { slug } })
  if (!ws) throw new Error('workspace_not_found')

  const membership = await prisma.membership.findUnique({ where: { userId_workspaceId: { userId, workspaceId: ws.id } } })
  if (!membership) throw new Error('forbidden')

  return { userId, workspaceId: ws.id, slug }
}

