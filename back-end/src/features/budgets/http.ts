import { createRouter } from "@/lib/http/createApi";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import * as TransactionOperations from "./operations";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { mapErrorToResponse } from "@/lib/http/errorMapper";

const tags = ["Budgets"];

const getActiveBudgetRoute = createRoute({
  path: "/users/{id}/budgets/active",
  method: "get",
  tags: tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.uuid(),
        userId: z.uuid(),
        name: z.string(),
        startAmount: z.string(),
        currentAmount: z.string(),
        isActive: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
        deletedAt: z.date().nullable(),
        expenses: z.array(
          z.object({
            id: z.uuid(),
            budgetId: z.uuid(),
            description: z.string(),
            amount: z.string(),
            categoryId: z.uuid(),
            createdAt: z.date(),
            updatedAt: z.date(),
            deletedAt: z.date().nullable(),
            category: z.object({
              id: z.uuid(),
              key: z.string(),
              label: z.string(),
              icon: z.string(),
            }),
          }),
        ),
      }),
      "Active budget with expenses",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Active budget not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const getBudgetExpensesRoute = createRoute({
  path: "/budgets/{id}/expenses",
  method: "get",
  tags: tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.uuid(),
        userId: z.uuid(),
        name: z.string(),
        startAmount: z.string(),
        currentAmount: z.string(),
        isActive: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
        deletedAt: z.date().nullable(),
        expenses: z.array(
          z.object({
            id: z.uuid(),
            budgetId: z.uuid(),
            description: z.string(),
            amount: z.string(),
            categoryId: z.uuid(),
            createdAt: z.date(),
            updatedAt: z.date(),
            deletedAt: z.date().nullable(),
            category: z.object({
              id: z.uuid(),
              key: z.string(),
              label: z.string(),
              icon: z.string(),
            }),
          }),
        ),
        categoryBudgets: z.array(
          z.object({
            id: z.uuid(),
            budgetId: z.uuid(),
            categoryId: z.uuid(),
            allocatedAmount: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
            deletedAt: z.date().nullable(),
            category: z.object({
              id: z.uuid(),
              key: z.string(),
              label: z.string(),
              icon: z.string(),
            }),
          }),
        ),
        categoryBreakdown: z.array(
          z.object({
            id: z.uuid(),
            key: z.string(),
            label: z.string(),
            icon: z.string(),
            spent: z.string(),
            allocated: z.string().nullable(),
          }),
        ),
      }),
      "Budget with all expenses",
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

const getBudgetExpensesHandler = async (c: Context) => {
  const budgetId = c.req.param("id");
  const user = c.get("user") as { userId: string };
  const ctx = createContext();
  const result = await TransactionOperations.getBudgetExpenses(
    budgetId,
    user.userId,
    ctx,
  );

  return result.match(
    (budget) => c.json(budget, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const getActiveBudgetHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const ctx = createContext();
  const result = await TransactionOperations.getActiveBudgetWithExpenses(
    user.userId,
    ctx,
  );

  return result.match(
    (budget) => c.json(budget, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

export const budgetRouter = createRouter()
  .openapi(getBudgetExpensesRoute, getBudgetExpensesHandler)
  .openapi(getActiveBudgetRoute, getActiveBudgetHandler);
