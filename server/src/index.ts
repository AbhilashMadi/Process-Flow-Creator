import { Hono } from 'hono';
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from 'hono/secure-headers'

// Configs
import cors from '~configs/cors.config';
import DBConnection from '~configs/db.config';

// Handlers (Controllers)
import exceptionController from '~controllers/exception.controller';
import notFoundController from '~controllers/not-found.controller';

// Middelewares
import responseMiddleware from '~middlewares/response.middleware';
import rateLimitMiddleware from "~middlewares/rate-limit.middleware";

// Routes
import workflowRoutes from '~routes/workflows';
import monitorRoutes from '~routes/monitor.routes';

import { env } from '~configs/env.config';

const app = new Hono({ strict: false })

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
app.route('/workflows', workflowRoutes)
app.route('/monitor', monitorRoutes)

// Global Handlers
app.onError(exceptionController);
app.notFound(notFoundController);

export default {
  port: env.PORT,
  host: env.HOST,
  fetch: app.fetch,
}
