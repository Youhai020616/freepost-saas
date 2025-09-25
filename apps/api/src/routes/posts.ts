import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { requireSessionAndWorkspace } from '../middleware/context'
const prisma = new PrismaClient({ log: ['error', 'warn'] })

export const posts = new Hono()

// GET /w/:slug/posts
posts.get('/w/:slug/posts', async (c) => {
  try {
    const { workspaceId } = await requireSessionAndWorkspace(c)
    const list = await prisma.post.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } })
    return c.json({ data: list })
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

// POST /w/:slug/posts
posts.post('/w/:slug/posts', async (c) => {
  try {
    const { workspaceId } = await requireSessionAndWorkspace(c)
    const body = await c.req.json()
    const { content, targetAccounts, mediaIds, scheduledAt } = body ?? {}
    if (!content) return c.json({ error: 'content required' }, 400)

    const post = await prisma.post.create({
      data: {
        workspaceId,
        content,
        targetAccounts: targetAccounts ?? null,
        mediaIds: mediaIds ?? null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
      },
    })
    return c.json({ data: post }, 201)
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

// GET /w/:slug/posts/:id
posts.get('/w/:slug/posts/:id', async (c: any) => {
  try {
    const { workspaceId } = await requireSessionAndWorkspace(c)
    const { id } = c.req.param()
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.workspaceId !== workspaceId) return c.json({ error: 'Not found' }, 404)
    return c.json({ data: post })
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

// PATCH /w/:slug/posts/:id
posts.patch('/w/:slug/posts/:id', async (c: any) => {
  try {
    const { workspaceId } = await requireSessionAndWorkspace(c)
    const { id } = c.req.param()
    const body = await c.req.json()

// POST /w/:slug/posts/:id/publish
posts.post('/w/:slug/posts/:id/publish', async (c: any) => {
  try {
    const { workspaceId } = await requireSessionAndWorkspace(c)
    const { id } = c.req.param()
    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing || existing.workspaceId !== workspaceId) return c.json({ error: 'Not found' }, 404)
    await prisma.post.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() } })
    return c.json({ success: true })
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

// POST /w/:slug/posts/schedule
posts.post('/w/:slug/posts/schedule', async (c: any) => {
  try {
    const { workspaceId } = await requireSessionAndWorkspace(c)
    const body = await c.req.json()
    const { postId, runAt, cron } = body ?? {}
    if (!(postId && (runAt || cron))) return c.json({ error: '(postId + runAt|cron) required' }, 400)

    const existing = await prisma.post.findUnique({ where: { id: postId } })
    if (!existing || existing.workspaceId !== workspaceId) return c.json({ error: 'Not found' }, 404)

    const job = await prisma.schedulerJob.create({
      data: {
        workspaceId,
        postId,
        runAt: runAt ? new Date(runAt) : null,
        cron: cron ?? null,
        status: 'QUEUED',
      },
    })
    return c.json({ data: job }, 201)
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing || existing.workspaceId !== workspaceId) return c.json({ error: 'Not found' }, 404)
    const post = await prisma.post.update({ where: { id }, data: body })
    return c.json({ data: post })
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

// DELETE /w/:slug/posts/:id
posts.delete('/w/:slug/posts/:id', async (c) => {
  try {
    const { workspaceId } = await requireSessionAndWorkspace(c)
    const { id } = c.req.param()
    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing || existing.workspaceId !== workspaceId) return c.json({ error: 'Not found' }, 404)
    await prisma.post.delete({ where: { id } })
    return c.json({ success: true })
  } catch (e: any) {
    const msg = String(e?.message || e)
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg === 'workspace_not_found' ? 404 : 400
    return c.json({ error: msg }, status)
  }
})

