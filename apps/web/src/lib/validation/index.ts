/**
 * Validation utilities for API routes
 *
 * Provides helpers for validating request bodies, query parameters,
 * and route parameters with Zod schemas.
 */

import { NextRequest } from 'next/server';
import { z, ZodSchema } from 'zod';
import { errors } from '../errors';

/**
 * Validate request JSON body against a schema
 *
 * @throws ApiError if validation fails
 *
 * Usage:
 *   const data = await validateRequest(req, createPostSchema);
 */
export async function validateRequest<T extends ZodSchema>(
  req: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.validation('Invalid request data', error.issues);
    }
    if (error instanceof SyntaxError) {
      throw errors.badRequest('Invalid JSON in request body');
    }
    throw error;
  }
}

/**
 * Validate query parameters against a schema
 *
 * @throws ApiError if validation fails
 *
 * Usage:
 *   const params = validateQuery(req, listPostsSchema);
 */
export function validateQuery<T extends ZodSchema>(
  req: NextRequest,
  schema: T
): z.infer<T> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams.entries());

    // Convert numeric strings to numbers for common pagination params
    if (params.page) params.page = Number(params.page);
    if (params.limit) params.limit = Number(params.limit);

    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.validation('Invalid query parameters', error.issues);
    }
    throw error;
  }
}

/**
 * Validate route parameters (from dynamic routes)
 *
 * @throws ApiError if validation fails
 *
 * Usage:
 *   const { id } = validateParams(await params, z.object({ id: patterns.cuid }));
 */
export function validateParams<T extends ZodSchema>(
  params: Record<string, string | string[]>,
  schema: T
): z.infer<T> {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.validation('Invalid route parameters', error.issues);
    }
    throw error;
  }
}

/**
 * Validate and parse multipart form data
 *
 * @throws ApiError if validation fails
 *
 * Usage:
 *   const formData = await validateFormData(req, uploadSchema);
 */
export async function validateFormData<T extends ZodSchema>(
  req: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.validation('Invalid form data', error.issues);
    }
    throw error;
  }
}

/**
 * Type guard to check if value is defined
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Parse and validate JSON string
 */
export function parseJson<T extends ZodSchema>(
  jsonString: string,
  schema: T
): z.infer<T> {
  try {
    const data = JSON.parse(jsonString);
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.validation('Invalid JSON data', error.issues);
    }
    if (error instanceof SyntaxError) {
      throw errors.badRequest('Invalid JSON format');
    }
    throw error;
  }
}

/**
 * Validate array of items against a schema
 */
export function validateArray<T extends ZodSchema>(
  items: unknown[],
  itemSchema: T
): z.infer<T>[] {
  return items.map((item, index) => {
    try {
      return itemSchema.parse(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw errors.validation(`Invalid item at index ${index}`, error.issues);
      }
      throw error;
    }
  });
}
