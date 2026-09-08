import { createError } from "@/lib/utils/createError";

export const UserAlreadyOnboardedError = createError(
  "UserAlreadyOnboardedError",
  (userId: string) => `User is already onboarded`,
  {
    code: "USER_ALREADY_ONBOARDED",
    error: "Conflict",
    statusCode: 409,
  },
);
