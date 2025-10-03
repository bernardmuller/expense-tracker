import { generateUuid } from "@/lib/utils/generateUuid";
import type { TransactionType } from "./types/TransactionType";
import { Effect } from "effect";
import { AlreadyDeletedError, UpdateTransactionError } from "@/lib/errors";

export type Transaction = {
  readonly id: string;
  readonly budgetId: string;
  readonly categoryId: string;
  type: TransactionType;
  description: string;
  amount: number;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateTransactionParams = Omit<Transaction, 'id'>

export function createTransaction(params: CreateTransactionParams) {
  return Effect.succeed({
    id: generateUuid(),
    ...params,
    deletedAt: undefined
  })
}

export function updateTransaction(transaction: Transaction, params: Transaction) {
  if (transaction.id !== params.id || transaction.categoryId !== params.categoryId || transaction.budgetId !== params.budgetId) {
    return Effect.fail(new UpdateTransactionError())
  }
  return Effect.succeed({
    ...transaction,
    amount: params.amount,
    description: params.description,
    type: params.type,
    updatedAt: new Date().toLocaleString()
  })
}

export function softDeleteTransaction(transaction: Transaction) {
  if (transaction.deletedAt) return Effect.fail(new AlreadyDeletedError())
  return Effect.succeed({
    ...transaction,
    deletedAt: new Date().toLocaleString(),
  });
}
