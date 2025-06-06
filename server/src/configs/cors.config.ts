import type { Context } from "hono";
import { cors } from 'hono/cors';
import { env } from '~configs/env.config';

export default cors({
  origin: (origin: string, c: Context) => {
    // If no origin (non-browser like curl, postman etc), allow
    if (!origin) return undefined;

    // Allow if origin is in the approved list
    return env.CONSUMERS.includes(origin) ? origin : null;
  },
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "PATCH", "DELETE", "PUT", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
})