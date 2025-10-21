import { createError } from "@/lib/utils/createError";

export const UserAlreadyOnboardedError = createError(
  "UserAlreadyOnboardedError",
  (userId: string) => `User ${userId} is already onboarded`,
  {
    code: "USER_ALREADY_ONBOARDED",
    error: "Conflict",
    statusCode: 409,
  },
);

export const UserAlreadyVerifiedError = createError(
  "UserAlreadyVerifiedError",
  (userId: string) => `User ${userId} is already verified`,
  {
    code: "USER_ALREADY_VERIFIED",
    error: "Conflict",
    statusCode: 409,
  },
);

export type UserValidationError =
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof UserAlreadyVerifiedError>;
