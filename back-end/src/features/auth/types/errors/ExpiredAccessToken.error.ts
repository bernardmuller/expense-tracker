import { createError } from "@/lib/utils/createError";

export const ExpiredAccessTokenError = createError(
  "ExpiredAccessTokenError",
  () => "Access token has expired",
  {
    code: "EXPIRED_ACCESS_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);
