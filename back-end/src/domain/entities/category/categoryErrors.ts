import { Data } from "effect";
import type { Category } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class CategoryAlreadySoftDeletedError extends Data.TaggedError(
  "CategoryAlreadySoftDeletedError",
)<{
  categoryId: string;
}> {}

export class InvalidCategoryUpdateError extends Data.TaggedError(
  "InvalidCategoryUpdateError",
)<{
  reason: string;
}> {}

export class InvalidCategoryLabelError extends Data.TaggedError(
  "InvalidCategoryLabelError",
)<{
  label: string;
}> {}

export class InvalidCategoryKeyError extends Data.TaggedError(
  "InvalidCategoryKeyError",
)<{
  key: string;
}> {}

export type CategoryValidationError =
  | MissingRequiredFieldsError
  | CategoryAlreadySoftDeletedError
  | InvalidCategoryUpdateError
  | InvalidCategoryLabelError
  | InvalidCategoryKeyError;
