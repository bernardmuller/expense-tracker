import { createError } from "@/lib/utils/createError";

export const InvalidVerificationTokenError = createError(
  "InvalidVerificationTokenError",
  (message: string) => `Invalid verification token: ${message}`,
  {
    code: "INVALID_VERIFICATION_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);
