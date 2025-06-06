import { Hono } from 'hono';
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from 'hono/secure-headers'

import cors from '~configs/cors.config';
import DBConnection from '~configs/db.config';
import exceptionHandler from '~handlers/exception.handler';
import notFoundHandler from '~handlers/not-found.handler';
import responseMiddleware from '~middlewares/response.middleware';
import rateLimitMiddleware from "~middlewares/rate-limit.middleware";
import { env } from '~configs/env.config';

const app = new Hono()

// Database connections
DBConnection();

// Global Middlewares
app.use(cors);
app.use(secureHeaders())
app.use(logger());
app.use(prettyJSON());

// Custom Middlewares
app.use(responseMiddleware)
app.use(rateLimitMiddleware)

// Register routes
app.get('/', (c) => {
  return c.success(null, { message: "HELLO WORLD!" })
})

// Global Handlers
app.onError(exceptionHandler);
app.notFound(notFoundHandler);

export default {
  port: env.PORT,
  host: env.HOST,
  fetch: app.fetch,
}
