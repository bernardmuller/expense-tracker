import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { getStreakQuerySchema, streakResponseSchema } from "../types";

const tags = ["Streaks"];

export const getStreakRoute = createRoute({
  path: "/streaks",
  method: "get",
  tags,
  request: {
    query: getStreakQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(streakResponseSchema, "User streak data"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
