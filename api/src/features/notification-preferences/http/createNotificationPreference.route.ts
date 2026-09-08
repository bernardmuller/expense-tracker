import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { notificationPreferenceSchema, createNotificationPreferenceSchema } from "../types";

const tags = ["Notification Preferences"];

export const createNotificationPreferenceRoute = createRoute({
  path: "/notification-preferences",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createNotificationPreferenceSchema, "Notification preference to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({ notificationPreference: notificationPreferenceSchema }),
      "Created notification preference",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(errorResponseSchema, "Validation error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorResponseSchema, "Internal server error"),
  },
});
