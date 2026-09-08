import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

const tags = ["Health"];

export const healthRoute = createRoute({
  path: "/health",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.string(), "Server is running"),
  },
});
