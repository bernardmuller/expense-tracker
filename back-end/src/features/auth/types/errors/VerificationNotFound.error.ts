import { createError } from "@/lib/utils/createError";

export const VerificationNotFoundError = createError(
  "VerificationNotFoundError",
  () => "Verification record not found",
  {
    code: "VERIFICATION_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);
