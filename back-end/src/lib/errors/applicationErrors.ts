import { createError } from "../utils/createError";

export const UserEmailAlreadyInUseError = createError(
  "UserEmailAlreadyInUseError",
  (email: string) => `User with email: ${email} already exists`,
  {
    code: "USER_EMAIL_ALREADY_IN_USE",
    error: "Validation Error",
    statusCode: 422,
  },
);
