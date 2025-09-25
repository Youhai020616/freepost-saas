import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { requireSessionAndWorkspace } from '../middleware/context'
const prisma = new PrismaClient({ log: ['error', 'warn'] })

// Simple in-memory state store for demo/dev
const stateStore = new Map<string, { slug: string; userId: string; returnTo?: string }>()
function randomState() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }

export const oauth = new Hono()

// GET /w/:slug/oauth/:provider/start
oauth.get('/w/:slug/oauth/:provider/start', async (c: any) => {
  const provider = c.req.param('provider')
  const slug = c.req.param('slug')
  const returnTo = c.req.query('return_to') || undefined
  try {
    const { userId } = await requireSessionAndWorkspace(c)
    const state = randomState()
    stateStore.set(state, { slug, userId, returnTo })

    // TODO: Implement real provider auth URL per provider. For now, mock redirect to callback.
    const url = new URL(c.req.url)
    const base = `${url.protocol}//${url.host}`
    const callbackUrl = `${base}/w/${encodeURIComponent(slug)}/oauth/${encodeURIComponent(provider)}/callback?code=mock-code&state=${encodeURIComponent(state)}`
    return c.redirect(callbackUrl, 302)
  } catch (e: any) {
    return c.text(String(e?.message || e), 400)
  }
})

// GET /w/:slug/oauth/:provider/callback
oauth.get('/w/:slug/oauth/:provider/callback', async (c: any) => {
  const provider = c.req.param('provider')
  const slug = c.req.param('slug')
  const code = c.req.query('code')
  const state = c.req.query('state')
  if (!state) return c.text('missing_state', 400)
  const meta = stateStore.get(state)
  if (!meta) return c.text('invalid_state', 400)
  stateStore.delete(state)

  try {
    // Resolve workspace and membership again
    const { userId, slug: ctxSlug } = meta
    if (ctxSlug !== slug) return c.text('slug_mismatch', 400)

    // TODO: Exchange `code` with real provider and obtain externalId, tokens, scopes, etc.
    // Mock external id
    const externalId = `${provider}:${userId}`

    const ws = await prisma.workspace.findUnique({ where: { slug } })
    if (!ws) return c.text('workspace_not_found', 404)

    // Upsert social account for this workspace+provider+externalId
    const acc = await prisma.socialAccount.upsert({
      where: { id: `${ws.id}-${provider}-${externalId}` } as any, // placeholder unique; switch to @@unique in schema if needed
      update: { accessToken: 'mock', refreshToken: null, meta: { provider, code, createdAt: new Date().toISOString() } as any },
      create: {
        workspaceId: ws.id,
        provider,
        externalId,
        accessToken: 'mock',
        refreshToken: null,
        meta: { provider, code, createdAt: new Date().toISOString() } as any,
      },
    } as any)

    const redirectTo = meta.returnTo || `/${encodeURIComponent(slug) ? 'w/' + encodeURIComponent(slug) : ''}`
    return c.redirect(redirectTo, 302)
  } catch (e: any) {
    return c.text(String(e?.message || e), 400)
  }
})

