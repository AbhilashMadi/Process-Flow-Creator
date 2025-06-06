import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '~configs/redis.config';

// Simple global rate limiter using sliding window algorithm
export const globalRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  prefix: 'rate-limit:global',
  analytics: true, // (Optional) analytics
});