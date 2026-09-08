import type { AppContext } from "@/lib/db/context";
import { budgetRecurringExpenses } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { BudgetRecurringExpense } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import type { DatabaseError } from "@/lib/errors/domain";
import { InstanceAlreadyPaidError } from "../types/errors";

/**
 * Atomic flip from unpaid → paid.
 *
 * Returns 0 rows when the instance is already paid or has been soft-deleted,
 * which prevents the race condition described in the spec.
 */
export const markInstancePaidAtomic = (
  instanceId: string,
  expenseId: string,
  ctx: AppContext,
): AppResult<
  BudgetRecurringExpense,
  DatabaseError | InstanceAlreadyPaidError
> => {
  const now = new Date();
  return fromDB(
    ctx.db
      .update(budgetRecurringExpenses)
      .set({ isPaid: true, expenseId, updatedAt: now })
      .where(
        and(
          eq(budgetRecurringExpenses.id, instanceId),
          eq(budgetRecurringExpenses.isPaid, false),
          isNull(budgetRecurringExpenses.deletedAt),
        ),
      )
      .returning(),
  ).andThen(([updated]) =>
    updated
      ? success(updated)
      : failure(new InstanceAlreadyPaidError(instanceId)),
  );
};
