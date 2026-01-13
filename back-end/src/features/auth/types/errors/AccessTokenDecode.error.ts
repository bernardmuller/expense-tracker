import { createError } from "@/lib/utils/createError";

export const AccessTokenDecodeError = createError(
  "AccessTokenDecodeError",
  (message: string) => `Failed to decode access token: ${message}`,
  {
    code: "ACCESS_TOKEN_DECODE_FAILED",
    error: "Unauthorized",
    statusCode: 401,
  },
);
