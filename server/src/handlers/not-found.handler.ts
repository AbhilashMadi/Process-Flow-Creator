import type { Context } from 'hono'
import { NotFoundException } from '~utils/http.exceptions'

export default function notFoundHandler(c: Context): Response {
  // Throw exception and let app.onError handle it
  throw new NotFoundException('Route not found', {
    path: c.req.path,
    method: c.req.method
  })
}
