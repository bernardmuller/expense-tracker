import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { updateUserPreferencesSchema, userPreferencesSchema } from "../types";

const tags = ["Users"];

export const updateUserPreferencesRoute = createRoute({
  path: "/users/{id}/preferences",
  method: "patch",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
    body: jsonContent(
      updateUserPreferencesSchema,
      "User preferences update data",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userPreferencesSchema,
      "User preferences updated successfully",
    ),
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
