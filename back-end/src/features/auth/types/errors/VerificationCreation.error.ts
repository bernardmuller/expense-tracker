import { createError } from "@/lib/utils/createError";

export const VerificationCreationError = createError(
  "VerificationCreationError",
  (message: string) => `Failed to create verification: ${message}`,
  {
    code: "VERIFICATION_CREATION_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);
