import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { streakResponseSchema } from "../types";

const tags = ["Streaks"];

export const checkInRoute = createRoute({
  path: "/streaks/check-in",
  method: "post",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      streakResponseSchema,
      "Updated streak after recording today's activity",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
