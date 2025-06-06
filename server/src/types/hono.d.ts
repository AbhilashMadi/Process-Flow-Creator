/**
 * Standard API response structure
 * @template T Type of the data payload
 */
export type APIResponse<T = any> = {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: { [key: string]: any; };
};

declare module 'hono' {
  interface ContextVariableMap {
    // Custom context variables here (Example: user: User)
  }

  interface Context {
    /**
     * Send a successful response
     * @template T Response data type
     * @param data Response payload
     * @param options Response options
     */
    success: <T = any>(
      data?: T,
      options?: {
        message?: string;
        status?: number;
        meta?: Record<string, any>;
      }
    ) => Response;

    /**
     * Send an error response
     * @param error Error message or Error object
     * @param options Error options
     */
    fail: (
      error: string | Error,
      options?: {
        code?: string;
        details?: any;
        status?: number;
        meta?: Record<string, any>;
      }
    ) => Response;
  }
}