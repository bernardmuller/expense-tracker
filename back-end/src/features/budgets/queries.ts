import type { AppContext } from "@/lib/db/context";
import { expenses, budgets, categories, userCategories } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq, desc, and } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { CategoryBudget, Transaction } from "./types";
import type { Budget } from "@/lib/db/schema";

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
