import { createError } from "@/lib/utils/createError";

export const OTPCompareError = createError(
  "OTPCompareError",
  (message: string) => `Failed to compare OTP: ${message}`,
  {
    code: "OTP_COMPARE_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);
