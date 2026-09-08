import type { AppContext } from "@/lib/db/context";
import { budgetRecurringExpenses } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { BudgetRecurringExpense } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findInstanceById = (
  instanceId: string,
  ctx: AppContext,
): AppResult<BudgetRecurringExpense, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .select()
      .from(budgetRecurringExpenses)
      .where(
        and(
          eq(budgetRecurringExpenses.id, instanceId),
          isNull(budgetRecurringExpenses.deletedAt),
        ),
      ),
  ).andThen(([instance]) =>
    instance
      ? success(instance)
      : failure(
          new NotFoundError(`Recurring expense instance: ${instanceId}`),
        ),
  );
