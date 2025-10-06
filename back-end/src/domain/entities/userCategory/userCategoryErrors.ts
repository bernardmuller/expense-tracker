import { Data } from "effect";
import type { UserCategory } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class UserCategoryAlreadySoftDeletedError extends Data.TaggedError(
  "UserCategoryAlreadySoftDeletedError",
)<{
  userCategoryId: string;
}> {}

export type UserCategoryValidationError =
  | MissingRequiredFieldsError
  | UserCategoryAlreadySoftDeletedError;
