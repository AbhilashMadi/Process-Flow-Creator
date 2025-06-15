import { Hono } from "hono";
import type { Context } from "hono";

const route = new Hono();

route.post('/', (c: Context) => { return c.json('create workflow') })
route.get('/:id', (c: Context) => { return c.json('get workflow') })

export default route;