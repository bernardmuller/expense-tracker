import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { transactionSchema } from "../types";

const tags = ["Transactions"];

export const deleteExpenseRoute = createRoute({
  path: "/users/{userId}/budgets/{budgetId}/expenses/{expenseId}",
  method: "delete",
  tags,
  request: {
    params: z.object({
      userId: z.uuid(),
      budgetId: z.uuid(),
      expenseId: z.uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      transactionSchema,
      "Expense deleted successfully",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      "Missing required parameters",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Expense or budget not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
