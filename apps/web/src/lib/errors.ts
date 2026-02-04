/**
 * Centralized error handling for API routes
 *
 * Provides consistent error responses, proper HTTP status codes,
 * and integration with logging system.
 *
 * Usage in API routes:
 *   import { ApiError, handleApiError } from '@/lib/errors';
 *
 *   try {
 *     // ... your logic
 *     throw new ApiError('NOT_FOUND', 'Workspace not found');
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';
import { ZodError } from 'zod';

/**
 * Standard error codes with HTTP status mapping
 */
export const ERROR_CODES = {
  // Client errors (4xx)
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  RATE_LIMIT: 429,

  // Server errors (5xx)
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get statusCode(): number {
    return ERROR_CODES[this.code];
  }
}

/**
 * Error response format
 */
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Handle API errors and return consistent NextResponse
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // Handle known ApiError
  if (error instanceof ApiError) {
    logger.warn('API error', {
      code: error.code,
      message: error.message,
      details: error.details,
    });

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    logger.warn('Validation error', {
      issues: error.issues,
    });

    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.issues,
        },
      },
      { status: 422 }
    );
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: unknown };

    // P2002: Unique constraint violation
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        {
          error: {
            code: 'CONFLICT',
            message: 'A record with this value already exists',
            details: prismaError.meta,
          },
        },
        { status: 409 }
      );
    }

    // P2025: Record not found
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Record not found',
          },
        },
        { status: 404 }
      );
    }
  }

  // Handle generic Error
  if (error instanceof Error) {
    logger.error('Unexpected error', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }

  // Handle unknown error type
  logger.error('Unknown error type', { error });

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}

/**
 * Common error factory functions
 */
export const errors = {
  unauthorized: (message = 'Authentication required') =>
    new ApiError('UNAUTHORIZED', message),

  forbidden: (message = 'Access denied') =>
    new ApiError('FORBIDDEN', message),

  notFound: (resource = 'Resource', id?: string) =>
    new ApiError('NOT_FOUND', `${resource}${id ? ` with id ${id}` : ''} not found`),

  badRequest: (message: string, details?: unknown) =>
    new ApiError('BAD_REQUEST', message, details),

  conflict: (message: string, details?: unknown) =>
    new ApiError('CONFLICT', message, details),

  validation: (message: string, details?: unknown) =>
    new ApiError('VALIDATION_ERROR', message, details),

  rateLimit: (message = 'Rate limit exceeded') =>
    new ApiError('RATE_LIMIT', message),

  internal: (message = 'Internal server error') =>
    new ApiError('INTERNAL_ERROR', message),
};

/**
 * Async error wrapper for API routes
 *
 * Usage:
 *   export const POST = withErrorHandling(async (req) => {
 *     // Your logic here
 *     // Errors are automatically caught and handled
 *   });
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
