import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { verificationSchema, createVerificationSchema } from "../types";

const tags = ["Verifications"];

export const createVerificationRoute = createRoute({
  path: "/verifications",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createVerificationSchema, "Verification to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({ verification: verificationSchema }),
      "Created verification",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorResponseSchema,
      "Validation error",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
