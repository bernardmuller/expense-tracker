import { Data } from "effect";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class InvalidTransactionUpdateError extends Data.TaggedError(
  "InvalidTransactionUpdateError",
)<{
  reason: string;
}> {}

export type TransactionError =
  | MissingRequiredFieldsError
  | InvalidTransactionUpdateError;
