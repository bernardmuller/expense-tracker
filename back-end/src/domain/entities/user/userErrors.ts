import { Data } from "effect";
import type { User } from ".";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
}> {}

export class UserAlreadySoftDeletedError extends Data.TaggedError(
  "UserAlreadySoftDeletedError",
)<{
  userId: string;
}> {}

export class UserAlreadyOnboardedError extends Data.TaggedError(
  "UserAlreadyOnboardedError",
)<{
  userId: string;
}> {}

export class UserAlreadyVerifiedError extends Data.TaggedError(
  "UserAlreadyVerifiedError",
)<{
  userId: string;
}> {}

export type UserValidationError =
  | MissingRequiredFieldsError
  | UserAlreadySoftDeletedError
  | UserAlreadyOnboardedError
  | UserAlreadyVerifiedError;
