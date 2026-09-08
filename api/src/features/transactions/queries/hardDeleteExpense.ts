import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Transaction } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const hardDeleteExpense = (
  expenseId: string,
  ctx: AppContext,
): AppResult<Transaction, DatabaseError> =>
  fromDB(
    ctx.db.delete(expenses).where(eq(expenses.id, expenseId)).returning(),
  ).andThen(([deletedExpense]) =>
    deletedExpense
      ? success(deletedExpense)
      : failure(new DatabaseError("Failed to delete expense")),
  );
