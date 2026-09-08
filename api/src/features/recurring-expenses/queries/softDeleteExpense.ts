import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const softDeleteExpense = (
  expenseId: string,
  ctx: AppContext,
): AppResult<{ id: string }, NotFoundError | DatabaseError> => {
  const now = new Date();
  return fromDB(
    ctx.db
      .update(expenses)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(expenses.id, expenseId))
      .returning({ id: expenses.id }),
  ).andThen(([deleted]) =>
    deleted ? success(deleted) : failure(new NotFoundError(`Expense: ${expenseId}`)),
  );
};
