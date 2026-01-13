import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { registerVerifyParamsSchema, registerVerifySchema } from "../types";

const tags = ["Auth"];

export const registerVerifyRoute = createRoute({
  path: "/register/verify",
  method: "post",
  tags,
  security: [{ Bearer: [] }],
  request: {
    body: jsonContentRequired(
      registerVerifyParamsSchema,
      "Verify OTP and complete registration",
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
      registerVerifySchema,
      "Registration completed successfully, user logged in",
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
