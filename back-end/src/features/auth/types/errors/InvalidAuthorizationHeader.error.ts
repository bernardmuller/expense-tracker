import { createError } from "@/lib/utils/createError";

export const InvalidAuthorizationHeaderError = createError(
  "InvalidAuthorizationHeaderError",
  () => "Authorization header must be in format: Bearer <token>",
  {
    code: "INVALID_AUTHORIZATION_HEADER",
    error: "Unauthorized",
    statusCode: 401,
  },
);
