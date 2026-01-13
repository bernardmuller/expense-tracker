import { createError } from "@/lib/utils/createError";

export const InvalidEmailAndOrPasswordError = createError(
  "InvalidEmailAndOrPasswordError",
  () => `Invalid email and/or password`,
  {
    code: "INVALID_EMAIL_AND_OR_PASSWORD",
    error: "Invalid email and/or password",
    statusCode: 401,
  },
);
