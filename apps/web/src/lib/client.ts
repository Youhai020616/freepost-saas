import { API_BASE, apiFetch } from './api'

export async function listPosts(slug: string) {
  const res = await apiFetch(`/w/${slug}/posts`)
  if (!res.ok) throw new Error(await res.text())
  const json = await res.json()
  return json.data
}

export async function createPost(slug: string, payload: any) {
  const res = await apiFetch(`/w/${slug}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).data
}

export async function getPost(slug: string, id: string) {
  const res = await apiFetch(`/w/${slug}/posts/${id}`)
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).data
}

export async function updatePost(slug: string, id: string, patch: any) {
  const res = await apiFetch(`/w/${slug}/posts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).data
}

export async function deletePost(slug: string, id: string) {
  const res = await apiFetch(`/w/${slug}/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).success
}

export async function publishPost(slug: string, id: string) {
  const res = await apiFetch(`/w/${slug}/posts/${id}/publish`, { method: 'POST' })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).success
}

export async function schedulePost(slug: string, payload: any) {
  const res = await apiFetch(`/w/${slug}/posts/schedule`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).data
}

export async function listWorkspaces(slug: string) {
  const res = await apiFetch(`/w/${slug}/workspaces`)
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).data
}

export async function createWorkspace(slug: string, payload: any) {
  const res = await apiFetch(`/w/${slug}/workspaces`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()).data
}

