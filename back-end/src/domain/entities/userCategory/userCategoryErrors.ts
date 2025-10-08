import { Data } from "effect";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export type UserCategoryValidationError = MissingRequiredFieldsError;
