import { createError } from "@/lib/utils/createError";

export const VerificationValidationError = createError(
  "VerificationValidationError",
  (field: string) => `${field} is required to create a verification`,
  {
    code: "VERIFICATION_VALIDATION",
    error: "Bad Request",
    statusCode: 400,
  },
);
