import { createError } from "@/lib/utils/createError";

export const InvalidAccessTokenError = createError(
  "InvalidAccessTokenError",
  () => "Access token is invalid or malformed",
  {
    code: "INVALID_ACCESS_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);
