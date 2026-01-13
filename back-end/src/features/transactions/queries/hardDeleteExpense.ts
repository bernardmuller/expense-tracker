import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { EntityDeleteError } from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Transaction } from "../types";

export const hardDeleteExpense = (
  expenseId: string,
  ctx: AppContext,
): ResultAsync<Transaction, InstanceType<typeof EntityDeleteError>> =>
  ResultAsync.fromPromise(
    ctx.db.delete(expenses).where(eq(expenses.id, expenseId)).returning(),
    (error) => new EntityDeleteError("Expense", error),
  ).andThen(([deletedExpense]) =>
    deletedExpense
      ? okAsync(deletedExpense)
      : errAsync(new EntityDeleteError("Expense")),
  );
