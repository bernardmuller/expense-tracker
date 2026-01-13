import { createError } from "@/lib/utils/createError";

export const JwtGenerationError = createError(
  "JwtGenerationError",
  (message: string) => `Failed to generate JWT: ${message}`,
  {
    code: "JWT_GENERATION_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);
