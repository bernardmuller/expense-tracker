import type { AppContext } from "@/lib/db/context";
import { expenses, budgets, categories } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq, desc, like } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Transaction } from "./types";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";

export const create = (
  transaction: Partial<Transaction>,
  ctx: AppContext,
): ResultAsync<Transaction, InstanceType<typeof EntityCreateError>> =>
  ResultAsync.fromPromise(
    (async () => {
      if (
        !transaction.id ||
        !transaction.budgetId ||
        !transaction.description ||
        !transaction.amount ||
        !transaction.categoryId
      ) {
        throw new Error("Missing required fields");
      }
      const [createdTransaction] = await ctx.db
        .insert(expenses)
        .values({
          id: transaction.id,
          budgetId: transaction.budgetId,
          description: transaction.description,
          amount: transaction.amount,
          categoryId: transaction.categoryId,
        })
        .returning();
      if (!createdTransaction) throw new EntityCreateError("Transaction");
      return createdTransaction;
    })(),
    (error) =>
      error instanceof EntityCreateError
        ? error
        : new EntityCreateError("Transaction", error),
  );

export const findByBudgetId = (
  budgetId: string,
  limit: number,
  ctx: AppContext,
): ResultAsync<Transaction[], InstanceType<typeof EntityReadError>> =>
  ResultAsync.fromPromise(
    ctx.db
      .select()
      .from(expenses)
      .where(eq(expenses.budgetId, budgetId))
      .orderBy(desc(expenses.createdAt))
      .limit(limit),
    (error) => new EntityReadError("Transaction", String(error)),
  );

export const findCategoryById = (
  categoryId: string,
  ctx: AppContext,
): ResultAsync<
  { id: string },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, categoryId)),
    (error) => new EntityReadError("Category", String(error)),
  ).andThen(([category]) =>
    category
      ? okAsync(category)
      : errAsync(new EntityNotFoundError(`Category: ${categoryId}`)),
  );

export const getExpenseById = (
  expenseId: string,
  ctx: AppContext,
): ResultAsync<
  Transaction,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(expenses).where(eq(expenses.id, expenseId)),
    (error) => new EntityReadError("Expense", String(error)),
  ).andThen(([expense]) =>
    expense
      ? okAsync(expense)
      : errAsync(new EntityNotFoundError(`Expense: ${expenseId}`)),
  );

export const getTransactions = (
  search: SearchQueries<
    Transaction,
    {
      budgetId: string;
      categoryId: string;
      userId: string;
      description: string;
    }
  >,
  ctx: AppContext,
): ResultAsync<Array<Transaction>, InstanceType<typeof EntityReadError>> => {
  const includesCategory = search.include?.includes("category");

  const baseSelect = {
    id: expenses.id,
    budgetId: expenses.budgetId,
    description: expenses.description,
    amount: expenses.amount,
    categoryId: expenses.categoryId,
    createdAt: expenses.createdAt,
    updatedAt: expenses.updatedAt,
    deletedAt: expenses.deletedAt,
  };

  const selectWithCategory = {
    ...baseSelect,
    category: {
      id: categories.id,
      key: categories.key,
      label: categories.label,
      icon: categories.icon,
    },
  };

  const queryBuilder = includesCategory
    ? ctx.db.select(selectWithCategory).from(expenses)
    : ctx.db.select(baseSelect).from(expenses);

  return ResultAsync.fromPromise(
    buildDrizzleQuery(
      queryBuilder,
      search,
      {
        budgetId: (value) => eq(expenses.budgetId, value),
        categoryId: (value) => eq(expenses.categoryId, value),
        userId: (value) => eq(budgets.userId, value),
        description: (value) => like(expenses.description, `%${value}%`),
      },
      {
        createdAt: expenses.createdAt,
      },
      {
        category: {
          table: categories,
          on: eq(expenses.categoryId, categories.id),
          fields: {
            id: categories.id,
            key: categories.key,
            label: categories.label,
            icon: categories.icon,
          },
        },
      },
    ),
    (error) => new EntityReadError("Transaction", String(error)),
  );
};

export const hardDeleteExpense = (
  expenseId: string,
  ctx: AppContext,
): ResultAsync<Transaction, InstanceType<typeof EntityDeleteError>> =>
  ResultAsync.fromPromise(
    ctx.db.delete(expenses).where(eq(expenses.id, expenseId)).returning(),
    (error) => new EntityDeleteError("Expense", error),
  ).andThen(([deletedExpense]) =>
    deletedExpense
      ? okAsync(deletedExpense)
      : errAsync(new EntityDeleteError("Expense")),
  );
