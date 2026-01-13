import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { loginRequestSchema, loginRequestResponseSchema } from "../types";

const tags = ["Auth"];

export const loginRequestRoute = createRoute({
  path: "/login/request",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      loginRequestSchema,
      "Request magic link login with email",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginRequestResponseSchema,
      "OTP sent successfully, returns verification token",
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
