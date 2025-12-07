import { generateUuid } from "@/lib/utils/generateUuid";
import { ok, type Result } from "neverthrow";
import type { CreateTransactionParams, Transaction } from "./types";
import type { Budget } from "@/lib/db/schema";

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

export const updateBudgetAfterTransaction = (
  budget: Budget,
  transactionAmount: number,
): Result<Budget, never> => {
  const currentAmount = parseFloat(budget.currentAmount);
  const newAmount = currentAmount - transactionAmount;

  return ok({
    ...budget,
    currentAmount: newAmount.toString(),
    updatedAt: new Date(),
  });
};

export const updateBudgetAfterDeletion = (
  budget: Budget,
  deletedExpenseAmount: number,
): Result<Budget, never> => {
  const currentAmount = parseFloat(budget.currentAmount);
  const newAmount = currentAmount + deletedExpenseAmount;

  return ok({
    ...budget,
    currentAmount: newAmount.toString(),
    updatedAt: new Date(),
  });
};
