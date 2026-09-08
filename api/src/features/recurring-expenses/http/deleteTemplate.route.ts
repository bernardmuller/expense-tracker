import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";

const tags = ["Recurring Expenses"];

export const deleteTemplateRoute = createRoute({
  path: "/recurring-expenses/{templateId}",
  method: "delete",
  tags,
  request: {
    params: z.object({ templateId: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Template soft-deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Template not found or access denied",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
