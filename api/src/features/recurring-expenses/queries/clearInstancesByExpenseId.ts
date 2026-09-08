import type { AppContext } from "@/lib/db/context";
import { budgetRecurringExpenses } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { BudgetRecurringExpense } from "../types";
import { AppResult, fromDB, success } from "@/lib/result";
import type { DatabaseError } from "@/lib/errors/domain";

/**
 * Reset every recurring-expense instance whose linked expense is being
 * hard-deleted: clear isPaid + expenseId so the obligation re-surfaces.
 */
export const clearInstancesByExpenseId = (
  expenseId: string,
  ctx: AppContext,
): AppResult<BudgetRecurringExpense[], DatabaseError> => {
  const now = new Date();
  return fromDB(
    ctx.db
      .update(budgetRecurringExpenses)
      .set({ isPaid: false, expenseId: null, updatedAt: now })
      .where(
        and(
          eq(budgetRecurringExpenses.expenseId, expenseId),
          isNull(budgetRecurringExpenses.deletedAt),
        ),
      )
      .returning(),
  ).andThen((rows) => success(rows));
};
