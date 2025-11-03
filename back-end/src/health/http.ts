import { createRouter } from "@/http/createApi";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { Context } from "hono";

const tags = ["Health"];

const healthRoute = createRoute({
  path: "/health",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.string(), "Server is running"),
  },
});

const healthHandler = async (c: Context) => {
  return c.json("OK", 200);
};

export const healthRouter = createRouter().openapi(healthRoute, healthHandler);
