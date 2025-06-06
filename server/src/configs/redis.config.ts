import { Redis } from '@upstash/redis'
import { env } from '~configs/env.config'

// Initialize Redis client
export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
})

// Redis health check
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Redis connection error:', error)
    return false
  }
}