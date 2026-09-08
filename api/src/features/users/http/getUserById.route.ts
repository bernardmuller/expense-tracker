import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { userSchema } from "../types";

const tags = ["Users"];

export const getUserByIdRoute = createRoute({
  path: "/users/{id}",
  method: "get",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchema, "Return a user"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "User not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
