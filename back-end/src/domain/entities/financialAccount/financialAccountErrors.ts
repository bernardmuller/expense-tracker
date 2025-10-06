import { Data } from "effect";
import type { FinancialAccount } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class FinancialAccountAlreadySoftDeletedError extends Data.TaggedError(
  "FinancialAccountAlreadySoftDeletedError",
)<{
  financialAccountId: string;
}> {}

export class InvalidFinancialAccountNameError extends Data.TaggedError(
  "InvalidFinancialAccountNameError",
)<{
  name: string;
}> {}

export class InvalidCurrentAmountError extends Data.TaggedError(
  "InvalidCurrentAmountError",
)<{
  amount: number;
}> {}

export class FinancialAccountTypeAlreadySetError extends Data.TaggedError(
  "FinancialAccountTypeAlreadySetError",
)<{
  type: string;
}> {}

export class InvalidSubtractionAmountError extends Data.TaggedError(
  "InvalidSubtractionAmountError",
)<{
  amount: number;
}> {}

export class InvalidAdditionAmountError extends Data.TaggedError(
  "InvalidAdditionAmountError",
)<{
  amount: number;
}> {}

export type FinancialAccountValidationError =
  | MissingRequiredFieldsError
  | FinancialAccountAlreadySoftDeletedError
  | InvalidFinancialAccountNameError
  | FinancialAccountTypeAlreadySetError
  | InvalidAdditionAmountError
  | InvalidSubtractionAmountError
  | InvalidCurrentAmountError;
