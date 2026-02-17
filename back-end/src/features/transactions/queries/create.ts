import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { EntityCreateError } from "@/lib/errors/actionErrors";
import { ResultAsync } from "neverthrow";
import type { Transaction } from "../types";

export const create = (
  transaction: Partial<Transaction>,
  ctx: AppContext,
): ResultAsync<Transaction, InstanceType<typeof EntityCreateError>> =>
  ResultAsync.fromPromise(
    (async () => {
      if (
        !transaction.id ||
        !transaction.budgetId ||
        !transaction.description ||
        !transaction.amount ||
        !transaction.categoryId
      ) {
        throw new Error("Missing required fields");
      }
      const [createdTransaction] = await ctx.db
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
        .returning();
      if (!createdTransaction) throw new EntityCreateError("Transaction");
      return createdTransaction;
    })(),
    (error) =>
      error instanceof EntityCreateError
        ? error
        : new EntityCreateError("Transaction", error),
  );
