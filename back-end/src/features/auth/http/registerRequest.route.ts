import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { registerRequestSchema, loginRequestResponseSchema } from "../types";

const tags = ["Auth"];

export const registerRequestRoute = createRoute({
  path: "/register/request",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      registerRequestSchema,
      "Request registration with email and name",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginRequestResponseSchema,
      "OTP sent successfully, returns verification token",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      "Email already in use",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
