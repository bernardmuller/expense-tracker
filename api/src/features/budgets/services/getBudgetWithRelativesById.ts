import type { AppContext } from "@/lib/db/context";
import type { Budget } from "@/lib/db/schema";
import type { CategoryBudget, Transaction } from "../types";
import { AppResult } from "@/lib/result";
import { ResultAsync } from "neverthrow";
import * as BudgetDomain from "../domain/budget-processing.domain";
import * as BudgetQueries from "../queries/index";

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

export const getBudgetWithRelativesById = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): AppResult<{
  budget: BudgetWithDetails;
  previous: string | null;
  next: string | null;
}> => {
  return BudgetQueries.findBudgetWithRelationsById(
    budgetId,
    userId,
    ctx,
  ).andThen((budget) => {
    const decrypted = BudgetDomain.decryptBudgetAmounts(budget);

    const previous = budget.createdAt
      ? BudgetQueries.findPreviousBudget(userId, budget.createdAt, ctx)
      : ResultAsync.fromSafePromise(Promise.resolve(null));

    const next = budget.createdAt
      ? BudgetQueries.findNextBudget(userId, budget.createdAt, ctx)
      : ResultAsync.fromSafePromise(Promise.resolve(null));

    return ResultAsync.combine([decrypted, previous, next]).map(
      ([decryptedAmounts, prevBudget, nextBudget]) => ({
        budget: {
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
          categoryBreakdown: BudgetDomain.calculateCategoryBreakdown(
            budget.expenses,
            budget.categoryBudgets || [],
          ),
        },
        previous: prevBudget?.id ?? null,
        next: nextBudget?.id ?? null,
      }),
    );
  });
};
