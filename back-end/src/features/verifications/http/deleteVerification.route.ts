import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { verificationSchema } from "../types";

const tags = ["Verifications"];

export const deleteVerificationRoute = createRoute({
  path: "/verifications/{id}",
  method: "delete",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ verification: verificationSchema }),
      "Deleted verification",
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
