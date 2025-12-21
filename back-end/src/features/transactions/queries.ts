import type { AppContext } from "@/lib/db/context";
import { expenses, budgets, categories, userCategories } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq, desc, and, like } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Transaction } from "./types";
import type { Budget } from "@/lib/db/schema";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import { Category, CategoryWithoutMetadata } from "../categories/types";

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

export const getActiveBudgetByUserId = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
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
  ).andThen((budget) => {
    if (!budget) {
      return errAsync(
        new EntityNotFoundError(`Active budget for user ${userId}`),
      );
    }

    return okAsync({
      id: budget.id,
      userId: budget.userId,
      name: budget.name,
      startAmount: budget.startAmount,
      currentAmount: budget.currentAmount,
      isActive: budget.isActive,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      deletedAt: budget.deletedAt,
      expenses: budget.expenses,
    });
  });

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

type CategoryBudget = {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  category: {
    id: string;
    key: string;
    label: string;
    icon: string;
  };
};

export const getBudgetWithExpensesByBudgetId = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
    categoryBudgets: CategoryBudget[];
    categoryBreakdown: Array<{
      id: string;
      key: string;
      label: string;
      icon: string;
      spent: string;
      allocated: string | null;
    }>;
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
        categoryBudgets: {
          with: {
            category: true,
          },
        },
      },
    }),
    (error) => new EntityReadError("Budget", String(error)),
  ).andThen((budget) => {
    if (!budget) {
      return errAsync(
        new EntityNotFoundError(`Budget ${budgetId} for user ${userId}`),
      );
    }

    const categoryMap = new Map<
      string,
      {
        id: string;
        key: string;
        label: string;
        icon: string;
        spent: number;
        allocated: number | null;
      }
    >();

    budget.expenses.forEach((expense) => {
      const existing = categoryMap.get(expense.categoryId);
      const spentAmount = parseFloat(expense.amount);

      if (existing) {
        existing.spent += spentAmount;
      } else {
        categoryMap.set(expense.categoryId, {
          id: expense.category.id,
          key: expense.category.key,
          label: expense.category.label,
          icon: expense.category.icon,
          spent: spentAmount,
          allocated: null,
        });
      }
    });

    budget.categoryBudgets?.forEach((categoryBudget) => {
      const existing = categoryMap.get(categoryBudget.categoryId);
      const allocatedAmount = parseFloat(categoryBudget.allocatedAmount);

      if (existing) {
        existing.allocated = allocatedAmount;
      } else {
        categoryMap.set(categoryBudget.categoryId, {
          id: categoryBudget.category.id,
          key: categoryBudget.category.key,
          label: categoryBudget.category.label,
          icon: categoryBudget.category.icon,
          spent: 0,
          allocated: allocatedAmount,
        });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.values())
      .filter(
        (category) =>
          category.spent > 0 || (category.allocated && category.allocated > 0),
      )
      .map((category) => ({
        id: category.id,
        key: category.key,
        label: category.label,
        icon: category.icon,
        spent: category.spent.toFixed(2),
        allocated:
          category.allocated !== null ? category.allocated.toFixed(2) : null,
      }));

    return okAsync({
      id: budget.id,
      userId: budget.userId,
      name: budget.name,
      startAmount: budget.startAmount,
      currentAmount: budget.currentAmount,
      isActive: budget.isActive,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      deletedAt: budget.deletedAt,
      expenses: budget.expenses,
      categoryBudgets: budget.categoryBudgets || [],
      categoryBreakdown,
    });
  });

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
