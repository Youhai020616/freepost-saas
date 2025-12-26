/**
 * Rate limiting utilities using Upstash Redis
 *
 * Protects API routes from abuse and DDoS attacks.
 * Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
 *
 * Security Note:
 * - Critical endpoints (auth, oauth) use FAIL-CLOSED strategy
 * - Non-critical endpoints use FAIL-OPEN to prioritize availability
 *
 * Usage in API routes:
 *   import { rateLimit } from '@/lib/rate-limit';
 *
 *   const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous';
 *   const { success, remaining } = await rateLimit(identifier);
 *   if (!success) {
 *     throw errors.rateLimit('Too many requests');
 *   }
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env, isFeatureEnabled, isProduction } from "./env";
import { logger } from "./logger";

// Track consecutive errors for alerting
let consecutiveErrors = 0;
const ERROR_THRESHOLD = 5;

// Initialize Redis client only if credentials are available
let redis: Redis | null = null;
let ratelimitInstance: Ratelimit | null = null;

if (isFeatureEnabled('redis')) {
  try {
    redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // Configure rate limiter
    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
      analytics: true,
      prefix: "@freepost/ratelimit",
    });

    logger.info('Rate limiting enabled with Upstash Redis');
  } catch (error) {
    logger.error('Failed to initialize rate limiting', { error });
  }
}

/**
 * Rate limiting configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Default: 10 requests per 10 seconds
  default: {
    requests: 10,
    window: "10 s" as const,
  },

  // Authentication: 5 requests per minute (prevent brute force)
  auth: {
    requests: 5,
    window: "1 m" as const,
  },

  // API routes: 30 requests per minute
  api: {
    requests: 30,
    window: "1 m" as const,
  },

  // OAuth: 3 requests per minute (prevent abuse)
  oauth: {
    requests: 3,
    window: "1 m" as const,
  },

  // Publishing: 5 requests per minute (prevent spam)
  publish: {
    requests: 5,
    window: "1 m" as const,
  },
};

/**
 * Create a rate limiter with custom configuration
 */
export function createRateLimiter(config: { requests: number; window: `${number} s` | `${number} m` | `${number} h` | `${number} d` }) {
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: "@freepost/ratelimit",
  });
}

// Critical endpoints that should FAIL-CLOSED (reject on error)
const CRITICAL_ENDPOINTS: (keyof typeof rateLimitConfigs)[] = ['auth', 'oauth'];

/**
 * Apply rate limiting to a request
 *
 * @param identifier - Unique identifier (IP, user ID, API key, etc.)
 * @param config - Optional custom rate limit configuration
 * @returns Rate limit result with success status and metadata
 *
 * Security behavior:
 * - Critical endpoints (auth, oauth): FAIL-CLOSED - reject requests on error
 * - Non-critical endpoints: FAIL-OPEN - allow requests on error (availability priority)
 * - Production without Redis: Log warning and allow (but should be configured)
 */
export async function rateLimit(
  identifier: string,
  config?: keyof typeof rateLimitConfigs
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const isCriticalEndpoint = config && CRITICAL_ENDPOINTS.includes(config);

  // If rate limiting is not configured
  if (!ratelimitInstance && !config) {
    // In production, log a warning for visibility
    if (isProduction) {
      logger.warn('Rate limiting not configured in production - consider enabling Redis');
    } else {
      logger.debug('Rate limiting not configured, allowing request');
    }
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  try {
    // Use custom config if provided
    const limiter = config
      ? createRateLimiter(rateLimitConfigs[config]) ?? ratelimitInstance
      : ratelimitInstance;

    if (!limiter) {
      // For critical endpoints in production, fail closed
      if (isCriticalEndpoint && isProduction) {
        logger.error('Rate limiter unavailable for critical endpoint', { config });
        return {
          success: false,
          limit: 0,
          remaining: 0,
          reset: Date.now() + 60000,
        };
      }
      logger.warn('Rate limiter not available');
      return {
        success: true,
        limit: 0,
        remaining: 0,
        reset: 0,
      };
    }

    const result = await limiter.limit(identifier);
    consecutiveErrors = 0; // Reset error counter on success

    if (!result.success) {
      logger.warn('Rate limit exceeded', {
        identifier,
        limit: result.limit,
        remaining: result.remaining,
      });
    }

    return result;
  } catch (error) {
    consecutiveErrors++;
    logger.error('Rate limiting error', { error, identifier, consecutiveErrors });

    // Alert if errors exceed threshold
    if (consecutiveErrors >= ERROR_THRESHOLD) {
      logger.error('ALERT: Rate limiter experiencing repeated failures', {
        consecutiveErrors,
        config,
      });
    }

    // SECURITY: Critical endpoints use FAIL-CLOSED strategy
    if (isCriticalEndpoint) {
      logger.warn('Rejecting request due to rate limiter error on critical endpoint', { config });
      return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: Date.now() + 60000, // Retry after 1 minute
      };
    }

    // Non-critical endpoints: FAIL-OPEN for availability
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }
}

/**
 * Get client identifier from request
 * Uses IP address, user ID, or API key
 */
export function getClientIdentifier(req: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from headers (works with Vercel)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'anonymous';

  return `ip:${ip}`;
}

/**
 * Middleware wrapper for rate limiting
 *
 * Usage:
 *   export const POST = withRateLimit(async (req) => {
 *     // Your handler logic
 *   }, 'auth');
 */
export function withRateLimit<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>,
  config?: keyof typeof rateLimitConfigs
) {
  return async (...args: T): Promise<Response> => {
    const req = args[0] as Request;
    const identifier = getClientIdentifier(req);

    const { success, limit, remaining, reset } = await rateLimit(identifier, config);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'RATE_LIMIT',
            message: 'Too many requests',
            limit,
            remaining,
            reset,
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(...args);
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  };
}
