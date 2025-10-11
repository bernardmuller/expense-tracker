import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";
import type { TransactionType } from "../enums/transactionType";
import {
  InvalidTransactionUpdateError,
  MissingRequiredFieldsError,
} from "./transactionErrors";

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
  const missingFields: string[] = [];
  if (!params.budgetId) missingFields.push("budgetId");
  if (!params.categoryId) missingFields.push("categoryId");
  if (!params.type) missingFields.push("type");
  if (!params.description) missingFields.push("description");
  if (params.amount === undefined) missingFields.push("amount");

  if (missingFields.length > 0) {
    return err(
      new MissingRequiredFieldsError({
        fields: missingFields,
      }),
    );
  }

  const uuid = generateUuid();

  return ok({
    ...params,
    id: uuid,
  });
};

export const updateTransaction = (
  transaction: Transaction,
  params: Transaction,
) => {
  if (transaction.id !== params.id) {
    return err(
      new InvalidTransactionUpdateError({
        reason: "Cannot update transaction id",
      }),
    );
  }

  if (transaction.categoryId !== params.categoryId) {
    return err(
      new InvalidTransactionUpdateError({
        reason: "Cannot update categoryId",
      }),
    );
  }

  if (transaction.budgetId !== params.budgetId) {
    return err(
      new InvalidTransactionUpdateError({
        reason: "Cannot update budgetId",
      }),
    );
  }

  return ok({
    ...transaction,
    amount: params.amount,
    description: params.description,
    type: params.type,
  });
};

export const isExpenseTransaction = (transaction: Transaction): boolean =>
  transaction.type === "expense";
