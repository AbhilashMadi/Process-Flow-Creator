import type { Context, Next } from 'hono'
import { globalRateLimiter } from '~configs/rate-limit.config'
import { StatusCodes } from '~/resources/status-codes'

export default async function (c: Context, next: Next) {
  const ip =
    c.req.header('x-forwarded-for') ||
    c.req.raw.headers.get('cf-connecting-ip') ||
    c.req.raw.headers.get('x-real-ip') ||
    c.req.raw.headers.get('host') ||
    'anonymous'

  const { success, reset } = await globalRateLimiter.limit(ip)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)

    return c.fail(`Rate limit exceeded. Try again in ${retryAfter} seconds.`, {
      status: StatusCodes.TOO_MANY_REQUESTS,
      code: 'TOO_MANY_REQUESTS',
      details: { retryAfter, ip },
      meta: { rateLimitReset: reset }
    })
  }

  return next()
}
