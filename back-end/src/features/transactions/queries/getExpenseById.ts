import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { EntityNotFoundError, EntityReadError } from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Transaction } from "../types";

export const getExpenseById = (
  expenseId: string,
  ctx: AppContext,
): ResultAsync<
  Transaction,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(expenses).where(eq(expenses.id, expenseId)),
    (error) => new EntityReadError("Expense", String(error)),
  ).andThen(([expense]) =>
    expense
      ? okAsync(expense)
      : errAsync(new EntityNotFoundError(`Expense: ${expenseId}`)),
  );
