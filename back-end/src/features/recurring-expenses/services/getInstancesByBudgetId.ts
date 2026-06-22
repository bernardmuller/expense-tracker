import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as BudgetRepo from "@/features/budgets/queries";
import { AppResult, failure } from "@/lib/result";
import { NotFoundError } from "@/lib/errors/domain";
import type { BudgetRecurringExpenseWithRelations } from "../queries/findInstancesByBudgetId";

export const getInstancesByBudgetId = (
  userId: string,
  budgetId: string,
  ctx: AppContext,
): AppResult<BudgetRecurringExpenseWithRelations[]> =>
  BudgetRepo.findBudgetById(budgetId, ctx).andThen((budget) => {
    if (budget.userId !== userId) {
      return failure(new NotFoundError(`Budget: ${budgetId}`));
    }
    return RecurringRepo.findInstancesByBudgetId(budgetId, ctx);
  });
