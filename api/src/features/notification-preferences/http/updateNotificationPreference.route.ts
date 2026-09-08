import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { notificationPreferenceSchema, updateNotificationPreferenceSchema } from "../types";

const tags = ["Notification Preferences"];

export const updateNotificationPreferenceRoute = createRoute({
  path: "/notification-preferences/{id}",
  method: "patch",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
    body: jsonContentRequired(updateNotificationPreferenceSchema, "Fields to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ notificationPreference: notificationPreferenceSchema }),
      "Updated notification preference",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(errorResponseSchema, "Validation error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorResponseSchema, "Internal server error"),
  },
});
