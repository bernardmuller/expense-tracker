import { createContext } from "@/lib/db/context";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { createRouter } from "@/lib/http/createApi";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as TransactionOperations from "./operations";
import { createTransactionSchema, transactionSchema } from "./types";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";
import { SearchQueries } from "@/lib/http/types";
import type { Transaction } from "./types";

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

const getTransactionsRoute = createRoute({
  path: "/transactions",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        transactions: z.array(transactionSchema),
        count: z.number(),
      }),
      "List of transactions",
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

const getTransactionsHandler = async (c: Context) => {
  return parseSearchQuery<
    Transaction,
    {
      budgetId: string;
      categoryId: string;
      userId: string;
      description: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["createdAt"],
    filterKeys: ["budgetId", "categoryId", "userId", "description"],
    allowedIncludes: ["category"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return TransactionOperations.getTransactions(search, ctx);
    })
    .match(
      (transactions) =>
        c.json({ transactions, count: transactions.length }, 200),
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
  .openapi(getUserCategoriesRoute, getUserCategoriesHandler)
  .openapi(getTransactionsRoute, getTransactionsHandler)
  .openapi(deleteExpenseRoute, deleteExpenseHandler);
