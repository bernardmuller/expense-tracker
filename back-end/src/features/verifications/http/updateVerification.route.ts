import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { verificationSchema, updateVerificationSchema } from "../types";

const tags = ["Verifications"];

export const updateVerificationRoute = createRoute({
  path: "/verifications/{id}",
  method: "patch",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
    body: jsonContentRequired(updateVerificationSchema, "Fields to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ verification: verificationSchema }),
      "Updated verification",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Verification not found",
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
