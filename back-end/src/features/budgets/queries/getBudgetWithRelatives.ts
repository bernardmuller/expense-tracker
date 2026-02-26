import type { AppContext } from "@/lib/db/context";
import { expenses, budgets } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq, desc, and, lt, gt, asc } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { CategoryBudget, Transaction } from "../types";
import type { Budget } from "@/lib/db/schema";
import {
  decrypt,
  isEncrypted,
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

type BudgetWithDetails = Budget & {
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
};

const decryptBudgetAmounts = (
  budget: Budget,
): ResultAsync<
  { currentAmount: string; startAmount: string },
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => {
  const decryptCurrentResult = isEncrypted(
    budget.currentAmount,
    budget.ca_iv,
    budget.ca_tag,
  )
    ? ResultAsync.fromPromise(
        decrypt(budget.currentAmount, budget.ca_iv!, budget.ca_tag!),
        (error) =>
          error instanceof EncryptionDecipherCreationError ||
          error instanceof EncryptionDecipherUpdateError ||
          error instanceof EncryptionDecipherFinalError
            ? error
            : new EntityReadError("Budget", String(error)),
      ).andThen((result) => result)
    : okAsync(budget.currentAmount);

  const decryptStartResult = isEncrypted(
    budget.startAmount,
    budget.sa_iv,
    budget.sa_tag,
  )
    ? ResultAsync.fromPromise(
        decrypt(budget.startAmount, budget.sa_iv!, budget.sa_tag!),
        (error) =>
          error instanceof EncryptionDecipherCreationError ||
          error instanceof EncryptionDecipherUpdateError ||
          error instanceof EncryptionDecipherFinalError
            ? error
            : new EntityReadError("Budget", String(error)),
      ).andThen((result) => result)
    : okAsync(budget.startAmount);

  return ResultAsync.combine([decryptCurrentResult, decryptStartResult]).map(
    ([currentAmount, startAmount]) => ({
      currentAmount,
      startAmount,
    }),
  );
};

const calculateCategoryBreakdown = (
  expenses: Array<{
    categoryId: string;
    amount: string;
    category: { id: string; key: string; label: string; icon: string };
  }>,
  categoryBudgets: Array<{
    categoryId: string;
    allocatedAmount: string;
    category: { id: string; key: string; label: string; icon: string };
  }>,
): Array<{
  id: string;
  key: string;
  label: string;
  icon: string;
  spent: string;
  allocated: string | null;
}> => {
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

  expenses.forEach((expense) => {
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

  categoryBudgets.forEach((categoryBudget) => {
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

  return Array.from(categoryMap.values())
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
};

const processBudgetWithDetails = (
  budget: Budget & {
    expenses: Array<{
      id: string;
      budgetId: string;
      description: string;
      amount: string;
      categoryId: string;
      note: string | null;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
      category: { id: string; key: string; label: string; icon: string };
    }>;
    categoryBudgets: Array<{
      id: string;
      budgetId: string;
      categoryId: string;
      allocatedAmount: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
      category: { id: string; key: string; label: string; icon: string };
    }>;
  },
): ResultAsync<
  BudgetWithDetails,
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => {
  return decryptBudgetAmounts(budget).map((decryptedAmounts) => {
    const categoryBreakdown = calculateCategoryBreakdown(
      budget.expenses,
      budget.categoryBudgets || [],
    );

    return {
      id: budget.id,
      userId: budget.userId,
      name: budget.name,
      startAmount: decryptedAmounts.startAmount,
      currentAmount: decryptedAmounts.currentAmount,
      sa_iv: budget.sa_iv,
      sa_tag: budget.sa_tag,
      ca_iv: budget.ca_iv,
      ca_tag: budget.ca_tag,
      isActive: budget.isActive,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      deletedAt: budget.deletedAt,
      startDate: budget.startDate,
      endDate: budget.endDate,
      expenses: budget.expenses,
      categoryBudgets: budget.categoryBudgets || [],
      categoryBreakdown,
    };
  });
};

export const getBudgetWithRelatives = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): ResultAsync<
  {
    budget: BudgetWithDetails;
    previous: string | null;
    next: string | null;
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
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
  ).andThen((mainBudget) => {
    if (!mainBudget) {
      return errAsync(
        new EntityNotFoundError(`Budget ${budgetId} for user ${userId}`),
      );
    }

    // Query for previous budget (by createdAt)
    const previousQuery = mainBudget.createdAt
      ? ResultAsync.fromPromise(
          ctx.db.query.budgets.findFirst({
            where: and(
              eq(budgets.userId, userId),
              lt(budgets.createdAt, mainBudget.createdAt),
            ),
            orderBy: desc(budgets.createdAt),
          }),
          (error) => new EntityReadError("Previous Budget", String(error)),
        )
      : okAsync(null);

    // Query for next budget (by createdAt)
    const nextQuery = mainBudget.createdAt
      ? ResultAsync.fromPromise(
          ctx.db.query.budgets.findFirst({
            where: and(
              eq(budgets.userId, userId),
              gt(budgets.createdAt, mainBudget.createdAt),
            ),
            orderBy: asc(budgets.createdAt),
          }),
          (error) => new EntityReadError("Next Budget", String(error)),
        )
      : okAsync(null);

    // Process main budget
    const mainBudgetResult = processBudgetWithDetails(mainBudget);

    // Combine all queries
    return ResultAsync.combine([
      mainBudgetResult,
      previousQuery,
      nextQuery,
    ]).map(([processedMainBudget, previous, next]) => ({
      budget: processedMainBudget,
      previous: previous?.id ?? null,
      next: next?.id ?? null,
    }));
  });
