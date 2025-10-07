import { generateUuid } from "@/lib/utils/generateUuid";
import type { TransactionType } from "../enums/transactionType";
import { Effect } from "effect";
import {
  MissingRequiredFieldsError,
  InvalidTransactionUpdateError,
} from "./transactionErrors";

export type Transaction = {
  readonly id: string;
  readonly budgetId: string;
  readonly categoryId: string;
  type: TransactionType;
  description: string;
  amount: number;
};

export type CreateTransactionParams = Omit<
  Transaction,
  "id"
>;

export const createTransaction = (
  params: CreateTransactionParams,
): Effect.Effect<Transaction, MissingRequiredFieldsError> =>
  Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!params.budgetId) missingFields.push("budgetId");
    if (!params.categoryId) missingFields.push("categoryId");
    if (!params.type) missingFields.push("type");
    if (!params.description) missingFields.push("description");
    if (params.amount === undefined) missingFields.push("amount");

    if (missingFields.length > 0) {
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );
    }

    const uuid = yield* Effect.sync(() => generateUuid());

    return {
      ...params,
      id: uuid,
    };
  });

export const updateTransaction = (
  transaction: Transaction,
  params: Transaction,
): Effect.Effect<Transaction, InvalidTransactionUpdateError> =>
  Effect.gen(function* () {
    if (transaction.id !== params.id) {
      return yield* Effect.fail(
        new InvalidTransactionUpdateError({
          reason: "Cannot update transaction id",
        }),
      );
    }

    if (transaction.categoryId !== params.categoryId) {
      return yield* Effect.fail(
        new InvalidTransactionUpdateError({
          reason: "Cannot update categoryId",
        }),
      );
    }

    if (transaction.budgetId !== params.budgetId) {
      return yield* Effect.fail(
        new InvalidTransactionUpdateError({
          reason: "Cannot update budgetId",
        }),
      );
    }

    return {
      ...transaction,
      amount: params.amount,
      description: params.description,
      type: params.type,
    };
  });

export const softDeleteTransaction = (
  transaction: Transaction,
): Effect.Effect<Transaction, never> =>
  Effect.gen(function* () {
    return yield* Effect.fail(
      new Error("Soft delete is not supported for transactions"),
    );
  });

export const isTransactionSoftDeleted = (transaction: Transaction): boolean =>
  false;
