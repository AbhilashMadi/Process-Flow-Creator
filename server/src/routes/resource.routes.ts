import { Hono } from "hono";
import type { Context } from "hono";

import { NotFoundException } from "~utils/http.exceptions";
import { nodes } from "~resources/mock/nodes.mock.json";
import { templates } from "~resources/mock/templates.mock.json";

type AvailableSource = "nodes" | "templates";

const route = new Hono();
const sources = new Map<AvailableSource, any>([
  ["nodes", nodes],
  ["templates", templates],
]);

route.get("/:resource", (c: Context) => {
  const resource = c.req.param("resource") as AvailableSource;

  if (!sources.has(resource)) {
    throw new NotFoundException();
  }

  const data = sources.get(resource);
  return c.success(data, { message: `Fetched ${resource} successfully.` });
});

export default route;
