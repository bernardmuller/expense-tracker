import type { AppContext } from "@/lib/db/context";
import { budgetRecurringExpenses } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { BudgetRecurringExpense } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const softDeleteInstance = (
  instanceId: string,
  ctx: AppContext,
): AppResult<BudgetRecurringExpense, NotFoundError | DatabaseError> => {
  const now = new Date();
  return fromDB(
    ctx.db
      .update(budgetRecurringExpenses)
      .set({ deletedAt: now, updatedAt: now })
      .where(
        and(
          eq(budgetRecurringExpenses.id, instanceId),
          isNull(budgetRecurringExpenses.deletedAt),
        ),
      )
      .returning(),
  ).andThen(([deleted]) =>
    deleted
      ? success(deleted)
      : failure(
          new NotFoundError(`Recurring expense instance: ${instanceId}`),
        ),
  );
};
