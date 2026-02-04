/**
 * Environment variable validation and type-safe access
 *
 * Validates all required environment variables at startup and provides
 * type-safe access with autocomplete support.
 *
 * Benefits:
 * - Early failure detection (startup vs runtime)
 * - Type safety with autocomplete
 * - Single source of truth for env vars
 * - Clear documentation of required variables
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid PostgreSQL URL'),

  // Authentication
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),

  // Cron Job Authentication (required for scheduled jobs security)
  CRON_SECRET: z.string().min(32, 'CRON_SECRET must be at least 32 characters for security').optional(),

  // Supabase Storage
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_STORAGE_BUCKET: z.string().default('media'),

  // Application
  APP_URL: z.string().url('APP_URL must be a valid URL').default('http://localhost:3000'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional: Stripe (for payments)
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Optional: Twitter OAuth (aligned with twitter.ts)
  OAUTH_TWITTER_CLIENT_ID: z.string().optional(),
  OAUTH_TWITTER_CLIENT_SECRET: z.string().optional(),

  // Optional: Redis (for rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Optional: Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Call this at application startup to ensure all required vars are present
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue =>
        `  - ${issue.path.join('.')}: ${issue.message}`
      ).join('\n');

      throw new Error(
        `Environment validation failed:\n${issues}\n\n` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }
    throw error;
  }
}

/**
 * Validated and type-safe environment variables
 *
 * Usage:
 *   import { env } from '@/lib/env';
 *   const dbUrl = env.DATABASE_URL; // Fully typed with autocomplete
 */
export const env = validateEnv();

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in test environment
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Get base URL for the application
 */
export const getBaseUrl = () => env.APP_URL;

/**
 * Check if feature is enabled based on environment
 */
export const isFeatureEnabled = (feature: 'stripe' | 'redis' | 'twitter'): boolean => {
  switch (feature) {
    case 'stripe':
      return !!(env.STRIPE_PUBLISHABLE_KEY && env.STRIPE_SECRET_KEY);
    case 'redis':
      return !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
    case 'twitter':
      return !!(env.OAUTH_TWITTER_CLIENT_ID && env.OAUTH_TWITTER_CLIENT_SECRET);
    default:
      return false;
  }
};
