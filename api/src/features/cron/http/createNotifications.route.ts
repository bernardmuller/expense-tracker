import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";

const tags = ["Cron"];

export const createNotificationsRoute = createRoute({
  path: "/cron/notifications/create",
  method: "post",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({ message: z.string() }), "Notifications created successfully"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorResponseSchema, "Unauthorized - missing or invalid x-auth header"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorResponseSchema, "Internal server error"),
  },
});
