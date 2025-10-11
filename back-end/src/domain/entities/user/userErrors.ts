import { createError } from "@/lib/utils/createError";

export const UserAlreadyOnboardedError = createError(
  "UserAlreadyOnboardedError",
  (userId: string) => `User ${userId} is already onboarded`,
);

export const UserAlreadyVerifiedError = createError(
  "UserAlreadyVerifiedError",
  (userId: string) => `User ${userId} is already verified`,
);

export type UserValidationError =
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof UserAlreadyVerifiedError>;
