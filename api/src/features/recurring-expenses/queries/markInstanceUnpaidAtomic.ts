import type { AppContext } from "@/lib/db/context";
import { budgetRecurringExpenses } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { BudgetRecurringExpense } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import type { DatabaseError } from "@/lib/errors/domain";
import { InstanceNotPaidError } from "../types/errors";

/**
 * Atomic flip from paid → unpaid.
 *
 * Returns 0 rows when the instance is not currently paid or is soft-deleted,
 * preventing a race when two unmark-paid requests arrive concurrently.
 */
export const markInstanceUnpaidAtomic = (
  instanceId: string,
  ctx: AppContext,
): AppResult<BudgetRecurringExpense, DatabaseError | InstanceNotPaidError> => {
  const now = new Date();
  return fromDB(
    ctx.db
      .update(budgetRecurringExpenses)
      .set({ isPaid: false, expenseId: null, updatedAt: now })
      .where(
        and(
          eq(budgetRecurringExpenses.id, instanceId),
          eq(budgetRecurringExpenses.isPaid, true),
          isNull(budgetRecurringExpenses.deletedAt),
        ),
      )
      .returning(),
  ).andThen(([updated]) =>
    updated
      ? success(updated)
      : failure(new InstanceNotPaidError(instanceId)),
  );
};
