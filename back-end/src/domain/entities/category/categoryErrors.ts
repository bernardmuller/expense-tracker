import { Data } from "effect";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
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
  | InvalidCategoryUpdateError
  | InvalidCategoryLabelError
  | InvalidCategoryKeyError;
