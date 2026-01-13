import { createError } from "@/lib/utils/createError";

export const InvalidRefreshTokenError = createError(
  "InvalidRefreshTokenError",
  () => "Refresh token is invalid or malformed",
  {
    code: "INVALID_REFRESH_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);
