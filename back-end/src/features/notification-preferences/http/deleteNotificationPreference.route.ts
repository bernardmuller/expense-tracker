import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { notificationPreferenceSchema } from "../types";

const tags = ["Notification Preferences"];

export const deleteNotificationPreferenceRoute = createRoute({
  path: "/notification-preferences/{id}",
  method: "delete",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ notificationPreference: notificationPreferenceSchema }),
      "Deleted notification preference",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorResponseSchema, "Internal server error"),
  },
});
