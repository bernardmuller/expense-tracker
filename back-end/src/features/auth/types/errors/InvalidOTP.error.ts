import { createError } from "@/lib/utils/createError";

export const InvalidOTPError = createError(
  "InvalidOTPError",
  () => "The OTP provided is incorrect",
  {
    code: "INVALID_OTP",
    error: "Unauthorized",
    statusCode: 401,
  },
);
