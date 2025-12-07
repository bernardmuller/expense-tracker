import { createRouter } from "@/lib/http/createApi";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import * as TransactionOperations from "./operations";
import { createTransactionSchema, transactionSchema } from "./types";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { mapErrorToResponse } from "@/lib/http/errorMapper";

const tags = ["Transactions"];

const createTransactionRoute = createRoute({
  path: "/budgets/{id}/transactions",
  method: "post",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
    body: jsonContent(createTransactionSchema, "Transaction creation data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      transactionSchema,
      "Transaction created successfully",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Budget or category not found",
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

const getActiveBudgetRoute = createRoute({
  path: "/users/{id}/budgets/active",
  method: "get",
  tags: ["Budgets"],
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

const getUserCategoriesRoute = createRoute({
  path: "/users/{id}/categories",
  method: "get",
  tags: ["Users"],
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          id: z.string().uuid(),
          key: z.string(),
          label: z.string(),
          icon: z.string(),
        }),
      ),
      "User categories",
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
  tags: ["Budgets"],
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

const deleteExpenseRoute = createRoute({
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

const createTransactionHandler = async (c: Context) => {
  const budgetId = c.req.param("id");
  const body = await c.req.json();
  const ctx = createContext();
  const result = await TransactionOperations.createTransaction(
    budgetId,
    body,
    ctx,
  );

  return result.match(
    (transaction) => c.json(transaction, 201),
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

const getUserCategoriesHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const ctx = createContext();
  const result = await TransactionOperations.getUserCategories(
    user.userId,
    ctx,
  );

  return result.match(
    (categories) => c.json(categories, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

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

const deleteExpenseHandler = async (c: Context) => {
  const { userId, budgetId, expenseId } = c.req.param();
  const ctx = createContext();
  const result = await TransactionOperations.deleteTransactionAndUpdateBudget(
    userId,
    budgetId,
    expenseId,
    ctx,
  );

  return result.match(
    (expense) => c.json(expense, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

export const transactionRouter = createRouter()
  .openapi(createTransactionRoute, createTransactionHandler)
  .openapi(getActiveBudgetRoute, getActiveBudgetHandler)
  .openapi(getUserCategoriesRoute, getUserCategoriesHandler)
  .openapi(getBudgetExpensesRoute, getBudgetExpensesHandler)
  .openapi(deleteExpenseRoute, deleteExpenseHandler);
