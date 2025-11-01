import { createError } from "../utils/createError";

export const EmailSendError = createError(
  "EmailSendError",
  (message: string) => message || "Failed to send email",
  {
    code: "EMAIL_SEND_ERROR",
    error: "Email Delivery Failed",
    statusCode: 500,
  },
);
