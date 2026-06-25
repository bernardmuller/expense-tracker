import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import {
  verificationSchema,
  verificationsQueryParamsSchema,
} from "../types";

const tags = ["Verifications"];

export const getVerificationsRoute = createRoute({
  path: "/verifications",
  method: "get",
  tags,
  request: {
    query: verificationsQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        verifications: z.array(verificationSchema),
        count: z.number(),
      }),
      "List of verifications",
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
