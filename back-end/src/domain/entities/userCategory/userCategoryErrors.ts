import { Data } from "effect";
import type { UserCategory } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export type UserCategoryValidationError = MissingRequiredFieldsError;
