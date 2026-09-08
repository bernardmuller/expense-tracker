import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { onboardingSchema, userSchema } from "../types";

const tags = ["Users"];

export const onboardUserRoute = createRoute({
  path: "/users/{id}/onboard",
  method: "post",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
    body: jsonContent(onboardingSchema, "Onboarding data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSchema,
      "User onboarded successfully",
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
