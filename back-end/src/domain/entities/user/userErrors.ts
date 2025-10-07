import { Data } from "effect";

export class MissingRequiredFieldsError extends Data.TaggedError(
  "MissingRequiredFieldsError",
)<{
  fields: string[];
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
  | UserAlreadyOnboardedError
  | UserAlreadyVerifiedError;
