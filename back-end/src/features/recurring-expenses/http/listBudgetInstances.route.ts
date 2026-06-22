import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { budgetRecurringExpenseSchema } from "../types";

const tags = ["Recurring Expenses"];

const categoryRelationSchema = z
  .object({
    id: z.string(),
    key: z.string(),
    label: z.string(),
    icon: z.string(),
  })
  .nullable();

const expenseRelationSchema = z
  .object({
    id: z.string(),
    description: z.string(),
    amount: z.string(),
    categoryId: z.string(),
    note: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
  })
  .nullable();

const instanceWithRelationsSchema = budgetRecurringExpenseSchema.extend({
  category: categoryRelationSchema,
  expense: expenseRelationSchema,
});

export const listBudgetInstancesRoute = createRoute({
  path: "/budgets/{budgetId}/recurring-expenses",
  method: "get",
  tags,
  request: {
    params: z.object({ budgetId: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ recurringExpenses: z.array(instanceWithRelationsSchema) }),
      "Budget recurring expense instances",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Budget not found or access denied",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
