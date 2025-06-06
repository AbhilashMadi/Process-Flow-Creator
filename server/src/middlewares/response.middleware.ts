import type { Context, Next } from 'hono';
import type { APIResponse } from '~/types/hono';

export default async function (c: Context, next: Next) {
  // Success response handler
  c.success = function <T = any>(
    data?: T,
    options: {
      message?: string;
      status?: number;
      meta?: Record<string, any>;
    } = {}
  ) {
    const {
      message = 'Request successful',
      status = 200,
      meta
    } = options;

    const response: APIResponse<T> = {
      status: 'success',
      message,
      data,
      meta
    };

    return c.json(response, status as any);
  };

  // Error response handler
  c.fail = function (
    error: string | Error,
    options: {
      code?: string;
      details?: any;
      status?: number;
      meta?: Record<string, any>;
    } = {}
  ) {
    const {
      code = 'INTERNAL_ERROR',
      details,
      status = 400,
      meta
    } = options;

    const responseStatus = status >= 500 ? 'error' : 'fail';
    const errorMessage = typeof error === 'string' ? error : error.message;

    const response: APIResponse = {
      status: responseStatus,
      message: errorMessage,
      error: {
        code,
        details
      },
      meta
    };

    return c.json(response, status as any);
  };

  // Continue to next middleware
  await next();
};