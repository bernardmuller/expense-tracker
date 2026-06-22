import type { AppContext } from "@/lib/db/context";
import { budgetRecurringExpenses } from "@/lib/db/schema";
import type { BudgetRecurringExpense } from "../types";
import { AppResult, fromDB, success } from "@/lib/result";
import type { DatabaseError } from "@/lib/errors/domain";

export const insertInstances = (
  instances: BudgetRecurringExpense[],
  ctx: AppContext,
): AppResult<BudgetRecurringExpense[], DatabaseError> => {
  if (instances.length === 0) {
    return success([]);
  }

  return fromDB(
    ctx.db
      .insert(budgetRecurringExpenses)
      .values(
        instances.map((instance) => ({
          id: instance.id,
          budgetId: instance.budgetId,
          description: instance.description,
          amount: instance.amount,
          categoryId: instance.categoryId,
          isPaid: instance.isPaid,
          expenseId: instance.expenseId,
          createdAt: instance.createdAt,
          updatedAt: instance.updatedAt,
          deletedAt: instance.deletedAt,
        })),
      )
      .returning(),
  ).andThen((rows) => success(rows));
};
