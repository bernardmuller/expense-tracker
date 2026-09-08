import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import {
  recurringExpenseTemplateSchema,
  updateTemplateSchema,
} from "../types";

const tags = ["Recurring Expenses"];

export const updateTemplateRoute = createRoute({
  path: "/recurring-expenses/{templateId}",
  method: "patch",
  tags,
  request: {
    params: z.object({ templateId: z.uuid() }),
    body: jsonContent(updateTemplateSchema, "Template update payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      recurringExpenseTemplateSchema,
      "Template updated successfully",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Template not found or access denied",
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
