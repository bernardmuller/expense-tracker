import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";
import type { TransactionType } from "../enums/transactionType";
import { InvalidTransactionUpdateError } from "./transactionErrors";

export type Transaction = {
  readonly id: string;
  readonly budgetId: string;
  readonly categoryId: string;
  type: TransactionType;
  description: string;
  amount: number;
};

export type CreateTransactionParams = Omit<Transaction, "id">;

export const createTransaction = (params: CreateTransactionParams) => {
  return ok({
    ...params,
    id: generateUuid(),
  });
};

export const updateTransaction = (
  transaction: Transaction,
  params: Transaction,
) => {
  if (transaction.id !== params.id)
    return err(
      new InvalidTransactionUpdateError("Cannot update transaction id"),
    );
  if (transaction.categoryId !== params.categoryId)
    return err(new InvalidTransactionUpdateError("Cannot update categoryId"));
  if (transaction.budgetId !== params.budgetId)
    return err(new InvalidTransactionUpdateError("Cannot update budgetId"));
  return ok({
    ...transaction,
    amount: params.amount,
    description: params.description,
    type: params.type,
  });
};

export const isExpenseTransaction = (transaction: Transaction): boolean =>
  transaction.type === "expense";
