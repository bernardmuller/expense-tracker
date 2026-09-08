import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";

const tags = ["Budgets"];

const budgetWithDetailsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  startAmount: z.string(),
  currentAmount: z.string(),
  sa_iv: z.string().nullable(),
  sa_tag: z.string().nullable(),
  ca_iv: z.string().nullable(),
  ca_tag: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  expenses: z.array(
    z.object({
      id: z.string(),
      budgetId: z.string(),
      description: z.string(),
      amount: z.string(),
      categoryId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      deletedAt: z.date().nullable(),
      category: z.object({
        id: z.string(),
        key: z.string(),
        label: z.string(),
        icon: z.string(),
      }),
    }),
  ),
  categoryBudgets: z.array(
    z.object({
      id: z.string(),
      budgetId: z.string(),
      categoryId: z.string(),
      allocatedAmount: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      deletedAt: z.date().nullable(),
      category: z.object({
        id: z.string(),
        key: z.string(),
        label: z.string(),
        icon: z.string(),
      }),
    }),
  ),
  categoryBreakdown: z.array(
    z.object({
      id: z.string(),
      key: z.string(),
      label: z.string(),
      icon: z.string(),
      spent: z.string(),
      allocated: z.string().nullable(),
    }),
  ),
});

export const getBudgetWithRelativesRoute = createRoute({
  path: "/budgets/{id}/with-relatives",
  method: "get",
  tags: tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        budget: budgetWithDetailsSchema,
        previous: z.string().nullable(),
        next: z.string().nullable(),
      }),
      "Budget with previous and next budget IDs",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Budget not found",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorResponseSchema,
      "Access denied",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
