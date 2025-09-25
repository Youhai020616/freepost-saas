export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

// Temporary dev helper: attach x-user-id until BetterAuth backend is wired.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(init.headers || {});
  if (!headers.has("x-user-id")) {
    headers.set("x-user-id", process.env.NEXT_PUBLIC_DEV_USER_ID || "dev-user-1");
  }
  return fetch(url, { ...init, headers });
}

