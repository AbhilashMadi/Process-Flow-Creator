import { Hono } from "hono";
import monitorController from "~/controllers/monitor.controller";

const route = new Hono();

// Basic health check route
route.get('/', monitorController);

export default route;
