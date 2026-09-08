import type { AppContext } from "@/lib/db/context";
import type { Budget } from "@/lib/db/schema";
import type { Transaction } from "../types";
import { AppResult } from "@/lib/result";
import * as BudgetQueries from "../queries/index";
import * as BudgetDomain from "../domain/budget-processing.domain";

export const getActiveBudgetWithExpenses = (
  userId: string,
  ctx: AppContext,
): AppResult<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
  }
> => {
  return BudgetQueries.findActiveBudgetWithExpenses(userId, ctx).andThen(
    (budget) => {
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
        }),
      );
    },
  );
};
