import { Hono } from 'hono'
import { prisma } from '@freepost/db'
import { requireSessionAndWorkspace } from '../middleware/context'

export const workspaces = new Hono()

// GET /w/:slug/workspaces - list workspaces for current user (membership)
workspaces.get('/w/:slug/workspaces', async (c) => {
  try {
    const { userId } = await requireSessionAndWorkspace(c)
    const memberships = await prisma.membership.findMany({ where: { userId }, include: { workspace: true } as any })
    return c.json({ data: memberships.map((m: any) => m.workspace) })
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

// POST /w/:slug/workspaces - create workspace owned by current user
workspaces.post('/w/:slug/workspaces', async (c) => {
  try {
    const { userId } = await requireSessionAndWorkspace(c)
    const body = await c.req.json()
    const { slug, plan } = body ?? {}
    if (!slug) return c.json({ error: 'slug required' }, 400)

    const ws = await prisma.workspace.create({
      data: {
        slug,
        ownerId: userId,
        plan: plan ?? 'free',
        members: { create: [{ userId, role: 'owner' }] },
      },
    })
    return c.json({ data: ws }, 201)
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

