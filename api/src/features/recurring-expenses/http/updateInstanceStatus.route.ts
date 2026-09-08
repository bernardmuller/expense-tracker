import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { transactionSchema } from "@/features/transactions/types";
import { updateInstanceStatusSchema } from "../types";

const tags = ["Recurring Expenses"];

export const updateInstanceStatusRoute = createRoute({
  path: "/budgets/{budgetId}/recurring-expenses/{instanceId}",
  method: "patch",
  tags,
  request: {
    params: z.object({ budgetId: z.uuid(), instanceId: z.uuid() }),
    body: jsonContent(
      updateInstanceStatusSchema,
      "Mark recurring expense paid or unpaid",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      transactionSchema,
      "Created expense when marking as paid",
    ),
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Instance unmarked as paid",
    },
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      "Validation error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Budget or instance not found",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      "Instance state conflict (already paid / not paid)",
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
