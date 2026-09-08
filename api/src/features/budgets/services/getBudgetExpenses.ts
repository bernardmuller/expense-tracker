import type { AppContext } from "@/lib/db/context";
import type { Budget } from "@/lib/db/schema";
import type { Transaction } from "../types";
import { AppResult } from "@/lib/result";
import * as BudgetQueries from "../queries/index";
import * as BudgetDomain from "../domain/budget-processing.domain";

export const getBudgetExpenses = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): AppResult<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
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
    categoryBreakdown: Array<{
      id: string;
      key: string;
      label: string;
      icon: string;
      spent: string;
      allocated: string | null;
    }>;
  }
> => {
  return BudgetQueries.findBudgetWithRelationsById(
    budgetId,
    userId,
    ctx,
  ).andThen((budget) => {
    return BudgetDomain.decryptBudgetAmounts(budget).map(
      (decryptedAmounts) => ({
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
        categoryBudgets: budget.categoryBudgets,
        categoryBreakdown: BudgetDomain.calculateCategoryBreakdown(
          budget.expenses,
          budget.categoryBudgets,
        ),
      }),
    );
  });
};
