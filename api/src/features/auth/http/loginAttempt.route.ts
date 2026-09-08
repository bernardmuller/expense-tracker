import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { loginAttemptSchema, loginResponseSchema } from "../types";

const tags = ["Auth"];

export const loginAttemptRoute = createRoute({
  path: "/login/verify",
  method: "post",
  tags,
  security: [{ Bearer: [] }],
  request: {
    body: jsonContentRequired(
      loginAttemptSchema,
      "Verify OTP and get access tokens",
    ),
    headers: z.object({
      authorization: z
        .string()
        .regex(/^Bearer .+$/)
        .describe("Verification token in format: Bearer <token>"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginResponseSchema,
      "OTP verified successfully, user logged in",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      "Missing/invalid authorization header, invalid or expired OTP",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Verification not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
