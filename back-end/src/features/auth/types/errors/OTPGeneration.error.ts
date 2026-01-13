import { createError } from "@/lib/utils/createError";

export const OTPGenerationError = createError(
  "OTPGenerationError",
  (message: string) => `Failed to generate OTP: ${message}`,
  {
    code: "OTP_GENERATION_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);
