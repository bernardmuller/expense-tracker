import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Transaction } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const getExpenseById = (
  expenseId: string,
  ctx: AppContext,
): AppResult<Transaction, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db.select().from(expenses).where(eq(expenses.id, expenseId)),
  ).andThen(([expense]) =>
    expense
      ? success(expense)
      : failure(new NotFoundError(`Expense: ${expenseId}`)),
  );
