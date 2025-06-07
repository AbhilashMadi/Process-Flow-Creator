import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';

// === Configurations ===
import cors from '~configs/cors.config';
import DBConnection from '~configs/db.config';

// === Global Middleware ===
import responseMiddleware from '~middlewares/response.middleware';
import rateLimitMiddleware from '~middlewares/rate-limit.middleware';

// === Routes ===
import workflowRoutes from '~routes/workflows';
import monitorRoutes from '~routes/monitor.routes';

// === Global Handlers ===
import exceptionController from '~controllers/exception.controller';
import notFoundController from '~controllers/not-found.controller';

// === App Setup ===
const app = new Hono({ strict: false });

// === Init DB Connections ===
DBConnection();

// === Global Middleware ===
app.use(cors);
app.use(secureHeaders());
app.use(logger());
app.use(prettyJSON());
app.use(responseMiddleware);
// app.use(rateLimitMiddleware);

// === Register Routes ===
app.route('/api/v1/workflows', workflowRoutes);
app.route('/api/v1/monitor', monitorRoutes);

// === Global Error Handlers ===
app.onError(exceptionController);
app.notFound(notFoundController);

export default app;