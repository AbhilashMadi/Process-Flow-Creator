import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '~configs/redis.config';

// Simple global rate limiter using sliding window algorithm
export const globalRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  prefix: 'rate-limit:global',
  analytics: true, // (Optional) analytics
});

// Rate limit response helper
export const rateLimitResponse = (reset: number) => {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return new Response(
    JSON.stringify({
      code: 429,
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
      },
    }
  );
};