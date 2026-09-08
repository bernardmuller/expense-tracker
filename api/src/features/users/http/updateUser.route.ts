import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { userSchema } from "../types";

const tags = ["Users"];

export const updateUserRoute = createRoute({
  path: "/users/{id}",
  method: "patch",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
    body: jsonContent(userSchema.partial(), "User update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchema, "User updated successfully"),
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
