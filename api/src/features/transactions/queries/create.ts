import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import type { Transaction } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError, ValidationError } from "@/lib/errors/domain";

export const create = (
  transaction: Partial<Transaction>,
  ctx: AppContext,
): AppResult<Transaction, DatabaseError | ValidationError> => {
  if (
    !transaction.id ||
    !transaction.budgetId ||
    !transaction.description ||
    !transaction.amount ||
    !transaction.categoryId
  ) {
    return failure(new ValidationError("Missing required transaction fields"));
  }

  return fromDB(
    ctx.db
      .insert(expenses)
      .values({
        id: transaction.id,
        budgetId: transaction.budgetId,
        description: transaction.description,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        note: transaction.note,
        createdAt: transaction.createdAt,
      })
      .returning(),
  ).andThen(([createdTransaction]) =>
    createdTransaction
      ? success(createdTransaction)
      : failure(new DatabaseError("Failed to create transaction")),
  );
};
