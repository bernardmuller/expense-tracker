import { Data } from "effect";
import type { Budget } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class InvalidStartAmountError extends Data.TaggedError(
  "InvalidStartAmountError",
)<{
  amount: number;
}> {}

export type BudgetValidationError =
  | MissingRequiredFieldsError
  | InvalidStartAmountError;

export class BudgetAlreadyActiveError extends Data.TaggedError(
  "BudgetAlreadyActiveError",
)<{
  budgetId: string;
}> {}

export class BudgetAlreadyInActiveError extends Data.TaggedError(
  "BudgetAlreadyInActiveError",
)<{
  budgetId: string;
}> {}

export class InvalidBudgetNameError extends Data.TaggedError(
  "InvalidBudgetNameError",
)<{
  name: string;
}> {}
