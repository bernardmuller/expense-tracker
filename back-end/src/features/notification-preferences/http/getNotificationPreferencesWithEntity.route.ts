import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import {
  notificationPreferenceWithEntitySchema,
  notificationPreferencesQueryParamsSchema,
} from "../types";

const tags = ["Notification Preferences"];

export const getNotificationPreferencesWithEntityRoute = createRoute({
  path: "/notification-preferences/with-entity",
  method: "get",
  tags,
  request: {
    query: notificationPreferencesQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        notificationPreferences: z.array(notificationPreferenceWithEntitySchema),
        count: z.number(),
      }),
      "List of notification preferences for the authenticated user, joined with the related entity (currently only recurring-expense-reminder templates).",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      "Invalid query parameters",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
