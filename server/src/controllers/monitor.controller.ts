import mongoose from 'mongoose';
import { Context } from 'hono';
import { redis } from '~configs/redis.config';
import { StatusCodes } from "~/resources/status-codes";
import { env } from '~configs/env.config';

export default async function monitorController(c: Context) {
  try {
    // Run parallel health checks
    const [mongoOk, redisOk] = await Promise.all([
      isMongoHealthy(),
      isRedisHealthy()
    ]);

    const healthy = mongoOk && redisOk;

    return c.success({
      services: { mongodb: mongoOk, redis: redisOk },
      worker: process.pid,
      uptime: process.uptime(),
      timestamp: Date.now(),
    }, { status: healthy ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE });

  } catch (error) {
    return c.json({
      status: 'unhealthy',
      error: (error as Error).message,
      worker: process.pid
    }, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

async function isMongoHealthy(): Promise<boolean> {
  if (mongoose.connection.readyState !== 1) return false;

  try {
    if (!mongoose.connection.db) return false;
    await Promise.race([
      mongoose.connection.db.admin().ping(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), env.HEALTH_CHECK_TIMEOUT)
      )
    ]);
    return true;
  } catch {
    return false;
  }
}

async function isRedisHealthy(): Promise<boolean> {
  try {
    const pong = await Promise.race([
      redis.ping(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), env.HEALTH_CHECK_TIMEOUT)
      )
    ]);
    return pong === 'PONG';
  } catch {
    return false;
  }
}