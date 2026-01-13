import { createError } from "@/lib/utils/createError";

export const RefreshTokenDecodeError = createError(
  "RefreshTokenDecodeError",
  (message: string) => `Failed to decode refresh token: ${message}`,
  {
    code: "REFRESH_TOKEN_DECODE_FAILED",
    error: "Unauthorized",
    statusCode: 401,
  },
);
