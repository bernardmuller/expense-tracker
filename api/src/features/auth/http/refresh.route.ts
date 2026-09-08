import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { loginResponseSchema } from "../types";

const tags = ["Auth"];

export const refreshRoute = createRoute({
  path: "/refresh",
  method: "post",
  tags,
  security: [{ Bearer: [] }],
  request: {
    headers: z.object({
      authorization: z
        .string()
        .regex(/^Bearer .+$/)
        .describe("Refresh token in format: Bearer <token>"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginResponseSchema,
      "Tokens refreshed successfully, returns new access and refresh tokens",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      "Missing/invalid authorization header, expired or invalid refresh token",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "User not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
