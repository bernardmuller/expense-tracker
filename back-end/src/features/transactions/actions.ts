import { generateUuid } from "@/lib/utils/generateUuid";
import { ok, type Result } from "neverthrow";
import type { CreateTransactionParams, Transaction } from "./types";

export const createTransaction = (
  budgetId: string,
  params: CreateTransactionParams,
): Result<Transaction, never> => {
  const uuid = generateUuid();
  const now = new Date();
  return ok({
    id: uuid,
    budgetId,
    description: params.description,
    amount: params.amount.toString(),
    categoryId: params.categoryId,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });
};
