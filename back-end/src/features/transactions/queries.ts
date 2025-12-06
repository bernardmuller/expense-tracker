import type { AppContext } from "@/lib/db/context";
import { expenses, budgets, categories, userCategories } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq, desc, and } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Transaction } from "./types";
import type { Budget } from "@/lib/db/schema";

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
): ResultAsync<
  Transaction[],
  InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .select()
      .from(expenses)
      .where(eq(expenses.budgetId, budgetId))
      .orderBy(desc(expenses.createdAt))
      .limit(limit),
    (error) => new EntityReadError("Transaction", String(error)),
  );

export const getActiveBudgetByUserId = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & { category: { id: string; key: string; label: string; icon: string } })[];
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.query.budgets.findFirst({
      where: and(eq(budgets.userId, userId), eq(budgets.isActive, true)),
      with: {
        expenses: {
          orderBy: desc(expenses.createdAt),
          limit: 5,
          with: {
            category: true,
          },
        },
        categoryBudgets: {
          with: {
            category: true,
          },
        },
      },
    }),
    (error) => new EntityReadError("Budget", String(error)),
  ).andThen((budget) =>
    budget
      ? okAsync(budget as any)
      : errAsync(new EntityNotFoundError(`Active budget for user ${userId}`)),
  );

export const getUserCategories = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Array<{ id: string; key: string; label: string; icon: string }>,
  InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .select({
        id: categories.id,
        key: categories.key,
        label: categories.label,
        icon: categories.icon,
      })
      .from(userCategories)
      .innerJoin(categories, eq(userCategories.categoryId, categories.id))
      .where(eq(userCategories.userId, userId)),
    (error) => new EntityReadError("UserCategories", String(error)),
  );

export const findBudgetById = (
  budgetId: string,
  ctx: AppContext,
): ResultAsync<
  Budget,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(budgets).where(eq(budgets.id, budgetId)),
    (error) => new EntityReadError("Budget", String(error)),
  ).andThen(([budget]) =>
    budget
      ? okAsync(budget)
      : errAsync(new EntityNotFoundError(`Budget: ${budgetId}`)),
  );

export const updateBudget = (
  budget: Budget,
  ctx: AppContext,
): ResultAsync<Budget, InstanceType<typeof EntityUpdateError>> =>
  ResultAsync.fromPromise(
    ctx.db
      .update(budgets)
      .set({
        ...budget,
        updatedAt: new Date(),
      })
      .where(eq(budgets.id, budget.id))
      .returning(),
    (error) => new EntityUpdateError("Budget", error),
  ).andThen(([updatedBudget]) =>
    updatedBudget
      ? okAsync(updatedBudget)
      : errAsync(new EntityUpdateError("Budget")),
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
    ctx.db.select({ id: categories.id }).from(categories).where(eq(categories.id, categoryId)),
    (error) => new EntityReadError("Category", String(error)),
  ).andThen(([category]) =>
    category
      ? okAsync(category)
      : errAsync(new EntityNotFoundError(`Category: ${categoryId}`)),
  );

export const getBudgetWithExpensesByBudgetId = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & { category: { id: string; key: string; label: string; icon: string } })[];
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.query.budgets.findFirst({
      where: and(eq(budgets.id, budgetId), eq(budgets.userId, userId)),
      with: {
        expenses: {
          orderBy: desc(expenses.createdAt),
          with: {
            category: true,
          },
        },
      },
    }),
    (error) => new EntityReadError("Budget", String(error)),
  ).andThen((budget) =>
    budget
      ? okAsync(budget as any)
      : errAsync(new EntityNotFoundError(`Budget ${budgetId} for user ${userId}`)),
  );
