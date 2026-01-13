import { createError } from "@/lib/utils/createError";

export const OTPHashError = createError(
  "OTPHashError",
  (message: string) => `Failed to hash otp: ${message}`,
  {
    code: "OTP_HASH_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);
