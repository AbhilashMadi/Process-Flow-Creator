import type { Context } from "hono"
import { StatusCodes } from "~resources/status-codes"
import { BaseException } from "~utils/http.exceptions"

export default async function ExceptionController(err: Error, c: Context) {
  if (err instanceof BaseException) {
    return c.fail(err.message, {
      status: err.statusCode,
      code: err.name,
      details: err.details
    })
  }

  // fallback for unknown errors
  return c.fail('Unexpected error occurred', {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_ERROR',
    details: err.stack
  })
}