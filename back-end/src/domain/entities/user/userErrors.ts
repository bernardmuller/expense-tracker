export class UserAlreadyOnboardedError extends Error {
  readonly _tag = "UserAlreadyOnboardedError";
  constructor(public userId: string) {
    super(`User ${userId} is already onboarded`);
    this.name = "UserAlreadyOnboardedError";
  }
}

export class UserAlreadyVerifiedError extends Error {
  readonly _tag = "UserAlreadyVerifiedError";
  constructor(public userId: string) {
    super(`User ${userId} is already verified`);
    this.name = "UserAlreadyVerifiedError";
  }
}

export type UserValidationError =
  | UserAlreadyOnboardedError
  | UserAlreadyVerifiedError;
