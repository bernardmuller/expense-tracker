import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { notificationPreferenceSchema, notificationPreferencesQueryParamsSchema } from "../types";

const tags = ["Notification Preferences"];

export const getNotificationPreferencesRoute = createRoute({
  path: "/notification-preferences",
  method: "get",
  tags,
  request: {
    query: notificationPreferencesQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        notificationPreferences: z.array(notificationPreferenceSchema),
        count: z.number(),
      }),
      "List of notification preferences for the authenticated user",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorResponseSchema, "Invalid query parameters"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorResponseSchema, "Internal server error"),
  },
});
