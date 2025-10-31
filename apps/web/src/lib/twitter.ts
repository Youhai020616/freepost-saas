import crypto from 'crypto'
import { prisma } from '@/lib/db'

// ===== Utility: PKCE =====
function base64url(input: Buffer) {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function generateCodeVerifier() {
  const verifier = base64url(crypto.randomBytes(32))
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest())
  return { verifier, challenge }
}

// ===== Twitter OAuth 2.0 (PKCE) =====
const TW_AUTH_URL = 'https://twitter.com/i/oauth2/authorize'
const TW_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token'
const TW_ME_URL = 'https://api.twitter.com/2/users/me'

const TW_SCOPES = ['tweet.read', 'tweet.write', 'users.read', 'offline.access']

type TwitterStatePayload = {
  slug: string
  userId: string
  returnTo?: string
  code_verifier: string
  redirect_uri: string
}

export async function persistTwitterState(state: string, payload: TwitterStatePayload) {
  await prisma.cache.upsert({
    where: { key: `oauth:twitter:${state}` },
    update: { value: payload as any, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    create: { key: `oauth:twitter:${state}`, value: payload as any, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  })
}

export async function consumeTwitterState(state: string | null) {
  if (!state) return null
  const rec = await prisma.cache.findUnique({ where: { key: `oauth:twitter:${state}` } })
  if (!rec) return null
  await prisma.cache.delete({ where: { key: `oauth:twitter:${state}` } })
  return rec.value as TwitterStatePayload
}

export async function createTwitterAuthUrl(input: { slug: string; userId: string; returnTo?: string; redirectUri: string }) {
  const clientId = process.env.OAUTH_TWITTER_CLIENT_ID
  if (!clientId) throw new Error('Missing OAUTH_TWITTER_CLIENT_ID')
  const { verifier, challenge } = generateCodeVerifier()
  const state = base64url(crypto.randomBytes(16))

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: input.redirectUri,
    scope: TW_SCOPES.join(' '),
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })

  await persistTwitterState(state, {
    slug: input.slug,
    userId: input.userId,
    returnTo: input.returnTo,
    code_verifier: verifier,
    redirect_uri: input.redirectUri,
  })

  return { state, authUrl: `${TW_AUTH_URL}?${params.toString()}` }
}

export async function exchangeTwitterToken(input: { code: string; code_verifier: string; redirect_uri: string }) {
  const clientId = process.env.OAUTH_TWITTER_CLIENT_ID
  if (!clientId) throw new Error('Missing OAUTH_TWITTER_CLIENT_ID')

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code: input.code,
    code_verifier: input.code_verifier,
    redirect_uri: input.redirect_uri,
  })

  const res = await fetch(TW_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`twitter token exchange failed: ${await res.text()}`)
  return (await res.json()) as { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; token_type: string }
}

export async function refreshTwitterToken(refresh_token: string) {
  const clientId = process.env.OAUTH_TWITTER_CLIENT_ID
  if (!clientId) throw new Error('Missing OAUTH_TWITTER_CLIENT_ID')

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token,
  })

  const res = await fetch(TW_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`twitter token refresh failed: ${await res.text()}`)
  return (await res.json()) as { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; token_type: string }
}

export async function getTwitterUser(accessToken: string) {
  const res = await fetch(TW_ME_URL, { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!res.ok) throw new Error(`twitter me failed: ${await res.text()}`)
  return (await res.json()) as { data: { id: string; name: string; username: string } }
}

export async function upsertTwitterAccount(input: { workspaceId: string; externalId: string; tokens: { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; token_type: string } }) {
  const now = Date.now()
  const expiresAt = input.tokens.expires_in ? new Date(now + input.tokens.expires_in * 1000) : null
  const existing = await prisma.socialAccount.findFirst({ where: { workspaceId: input.workspaceId, provider: 'twitter', externalId: input.externalId } })
  const meta = {
    provider: 'twitter',
    scope: input.tokens.scope,
    token_type: input.tokens.token_type,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    updatedAt: new Date().toISOString(),
  }
  if (existing) {
    await prisma.socialAccount.update({
      where: { id: existing.id },
      data: { accessToken: input.tokens.access_token, refreshToken: input.tokens.refresh_token ?? existing.refreshToken, meta: meta as any },
    })
  } else {
    await prisma.socialAccount.create({
      data: {
        workspaceId: input.workspaceId,
        provider: 'twitter',
        externalId: input.externalId,
        accessToken: input.tokens.access_token,
        refreshToken: input.tokens.refresh_token ?? null,
        meta: meta as any,
      },
    })
  }
}

export async function getValidTwitterAccessToken(socialAccountId: string) {
  const acc = await prisma.socialAccount.findUnique({ where: { id: socialAccountId } })
  if (!acc || acc.provider !== 'twitter') throw new Error('twitter account not found')
  const meta = (acc.meta as any) || {}
  const expiresAt = meta?.expiresAt ? new Date(meta.expiresAt) : null
  const now = new Date()
  if (expiresAt && expiresAt.getTime() - now.getTime() < 60 * 1000 && acc.refreshToken) {
    const tokens = await refreshTwitterToken(acc.refreshToken)
    const newExpiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null
    await prisma.socialAccount.update({
      where: { id: acc.id },
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? acc.refreshToken,
        meta: { ...(meta || {}), expiresAt: newExpiresAt ? newExpiresAt.toISOString() : null, updatedAt: new Date().toISOString() } as any,
      },
    })
    return tokens.access_token
  }
  return acc.accessToken
}

export async function postTweet(accessToken: string, text: string) {
  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ text })
  })
  if (!res.ok) throw new Error(`tweet failed: ${await res.text()}`)
  return await res.json()
}
