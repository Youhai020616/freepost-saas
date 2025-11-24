"use client";

import { createAuthClient } from "better-auth/react";

// Client-side BetterAuth instance for browser-based authentication
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Export authentication methods for easy use
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
