import { env } from '@configs/env.config'

export default {
  origin: (origin: string) => {
    // If no origin (non-browser like curl, postman etc), allow
    if (!origin) return true;

    // Allow if origin is in the approved list
    return env.CONSUMERS.includes(origin);
  },
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length"],
  maxAge: 86400,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}