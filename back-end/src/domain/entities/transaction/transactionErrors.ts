import { Data } from "effect";
import type { Transaction } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class TransactionAlreadySoftDeletedError extends Data.TaggedError(
  "TransactionAlreadySoftDeletedError",
)<{
  transactionId: string;
}> {}

export class InvalidTransactionUpdateError extends Data.TaggedError(
  "InvalidTransactionUpdateError",
)<{
  reason: string;
}> {}

export type TransactionValidationError =
  | MissingRequiredFieldsError
  | TransactionAlreadySoftDeletedError
  | InvalidTransactionUpdateError;
