import { createError } from "@/lib/utils/createError";

export const VerificationExpiredError = createError(
  "VerificationExpiredError",
  () => "The verification code has expired",
  {
    code: "VERIFICATION_EXPIRED",
    error: "Unauthorized",
    statusCode: 401,
  },
);
