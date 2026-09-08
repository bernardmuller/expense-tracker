import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import {
  createTemplateSchema,
  recurringExpenseTemplateSchema,
} from "../types";

const tags = ["Recurring Expenses"];

export const createTemplateRoute = createRoute({
  path: "/users/{userId}/recurring-expenses",
  method: "post",
  tags,
  request: {
    params: z.object({ userId: z.uuid() }),
    body: jsonContent(
      createTemplateSchema,
      "Recurring expense template payload",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      recurringExpenseTemplateSchema,
      "Template created successfully",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorResponseSchema,
      "Forbidden — userId does not match authenticated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "User or category not found",
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
