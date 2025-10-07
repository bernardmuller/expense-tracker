import { Data } from "effect";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class InvalidAllocatedAmountError extends Data.TaggedError(
  "InvalidAllocatedAmountError",
)<{
  amount: number;
}> {}

export type CategoryBudgetValidationError =
  | MissingRequiredFieldsError
  | InvalidAllocatedAmountError;
