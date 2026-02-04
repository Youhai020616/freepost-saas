/**
 * Reusable validation schemas for API routes
 *
 * Centralizes validation logic and provides type-safe
 * request/response handling with Zod.
 *
 * Usage in API routes:
 *   import { validateRequest } from '@/lib/validation';
 *   import { createPostSchema } from '@/lib/validation/schemas';
 *
 *   const data = await validateRequest(req, createPostSchema);
 *   // data is now fully typed and validated
 */

import { z } from 'zod';

/**
 * Common validation patterns
 */
export const patterns = {
  // CUID format (Prisma default ID)
  cuid: z.string().regex(/^c[a-z0-9]{24}$/, 'Invalid ID format'),

  // Workspace slug (URL-safe)
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),

  // Email
  email: z.string().email('Invalid email address'),

  // URL
  url: z.string().url('Invalid URL'),

  // Social media platform
  platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok']),

  // Post status
  postStatus: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED']),

  // ISO datetime
  datetime: z.string().datetime('Invalid datetime format'),

  // Pagination
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
  }),
};

/**
 * Workspace schemas
 */
export const workspaceSchemas = {
  create: z.object({
    slug: patterns.slug,
    name: z.string().min(1).max(100).optional(),
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    plan: z.enum(['free', 'pro', 'enterprise']).optional(),
  }),
};

/**
 * Post schemas
 */
export const postSchemas = {
  create: z.object({
    content: z.string().min(1, 'Content is required').max(10000),
    platform: patterns.platform.optional(),
    scheduledAt: z.string().datetime().optional(),
    mediaIds: z.array(patterns.cuid).optional(),
    targetAccounts: z.array(patterns.cuid).optional(),
  }),

  update: z.object({
    content: z.string().min(1).max(10000).optional(),
    scheduledAt: z.string().datetime().optional(),
    status: patterns.postStatus.optional(),
  }),

  schedule: z.object({
    postId: patterns.cuid,
    scheduledAt: z.string().datetime(),
  }),

  list: z.object({
    status: patterns.postStatus.optional(),
    platform: patterns.platform.optional(),
    ...patterns.pagination.shape,
  }),
};

/**
 * Social account schemas
 */
export const socialAccountSchemas = {
  connect: z.object({
    provider: patterns.platform,
    returnUrl: z.string().url().optional(),
  }),

  disconnect: z.object({
    accountId: patterns.cuid,
  }),
};

/**
 * Media schemas
 */
export const mediaSchemas = {
  upload: z.object({
    file: z.instanceof(File),
    workspaceId: patterns.cuid,
  }),

  metadata: z.object({
    url: patterns.url,
    mime: z.string(),
    size: z.number().int().positive(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  }),
};

/**
 * Auth schemas
 */
export const authSchemas = {
  signUp: z.object({
    email: patterns.email,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1).max(100).optional(),
  }),

  signIn: z.object({
    email: patterns.email,
    password: z.string().min(1, 'Password is required'),
  }),

  resetPassword: z.object({
    email: patterns.email,
  }),
};

/**
 * OAuth schemas
 */
export const oauthSchemas = {
  start: z.object({
    provider: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok']),
    return_to: z.string().optional(),
  }),

  callback: z.object({
    state: z.string().min(1),
    code: z.string().min(1).optional(),
    error: z.string().optional(),
  }),

  params: z.object({
    provider: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok']),
  }),
};

/**
 * Billing schemas
 */
export const billingSchemas = {
  checkout: z.object({
    plan: z.enum(['pro', 'enterprise']),
    returnUrl: z.string().url().optional(),
  }),

  portal: z.object({
    returnUrl: z.string().url().optional(),
  }),
};
