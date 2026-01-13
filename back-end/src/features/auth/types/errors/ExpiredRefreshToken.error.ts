import { createError } from "@/lib/utils/createError";

export const ExpiredRefreshTokenError = createError(
  "ExpiredRefreshTokenError",
  () => "Refresh token has expired",
  {
    code: "EXPIRED_REFRESH_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);
