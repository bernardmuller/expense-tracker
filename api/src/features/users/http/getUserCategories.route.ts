import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";

const tags = ["Users"];

export const getUserCategoriesRoute = createRoute({
  path: "/users/{id}/categories",
  method: "get",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          id: z.string().uuid(),
          key: z.string(),
          label: z.string(),
          icon: z.string(),
        }),
      ),
      "User categories",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
