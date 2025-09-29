import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

// Server-side BetterAuth instance
// Note: Keep configuration minimal for now; extend with providers as needed.
export const auth = betterAuth({
  // set a secret if provided (recommended for production)
  secret: process.env.AUTH_SECRET,

  // Enable email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // 暂时禁用邮箱验证以便开发测试
  },

  // Database configuration using Prisma adapter
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [
    nextCookies(), // must be last; handles cookies in Server Actions/Route Handlers
  ],
});

export type Auth = typeof auth;
