import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { userSchema } from "../types";

const tags = ["Users"];

export const markUserAsOnboardedRoute = createRoute({
  path: "/users/{id}/onboard",
  method: "patch",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSchema,
      "User marked as onboarded successfully",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      "User already onboarded",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
