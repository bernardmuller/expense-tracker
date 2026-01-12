import { createRouter } from "@/lib/http/createApi";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import * as TransactionOperations from "./operations";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { SearchQueries } from "@/lib/http/types";
import { Budget, budgetSchema } from "./types";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";

const tags = ["Budgets"];

const getBudgetsRoute = createRoute({
  path: "/budgets",
  method: "get",
  tags: tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        budgets: z.array(budgetSchema),
        count: z.number(),
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
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
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
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        startAmount: z.string(),
        currentAmount: z.string(),
        isActive: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
        deletedAt: z.string().nullable(),
        expenses: z.array(
          z.object({
            id: z.string(),
            budgetId: z.string(),
            description: z.string(),
            amount: z.string(),
            categoryId: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
            deletedAt: z.string().nullable(),
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
            createdAt: z.string(),
            updatedAt: z.string(),
            deletedAt: z.string().nullable(),
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
  const user = c.get("user");
  const ctx = createContext();
  const result = await TransactionOperations.getBudgetExpenses(
    budgetId,
    user.userId,
    ctx,
  );

  return result.match(
    (expenses) => c.json(expenses, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const getBudgetsHandler = async (c: Context) => {
  return parseSearchQuery<
    Budget,
    {
      isActive: boolean;
      userId: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["name", "isActive", "createdAt"],
    filterKeys: ["isActive", "userId"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return TransactionOperations.getBudgets(search, ctx);
    })
    .match(
      (budgets) => c.json({ budgets, count: budgets.length }, 200),
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
  .openapi(getBudgetsRoute, getBudgetsHandler)
  .openapi(getActiveBudgetRoute, getActiveBudgetHandler);
