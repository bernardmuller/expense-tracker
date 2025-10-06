import { Data } from "effect";
import type { CategoryBudget } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class CategoryBudgetAlreadySoftDeletedError extends Data.TaggedError(
  "CategoryBudgetAlreadySoftDeletedError",
)<{
  categoryBudgetId: string;
}> {}

export class InvalidAllocatedAmountError extends Data.TaggedError(
  "InvalidAllocatedAmountError",
)<{
  amount: number;
}> {}

export type CategoryBudgetValidationError =
  | MissingRequiredFieldsError
  | CategoryBudgetAlreadySoftDeletedError
  | InvalidAllocatedAmountError;
