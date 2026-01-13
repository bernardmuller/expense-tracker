import { createError } from "@/lib/utils/createError";

export const MissingAuthorizationHeaderError = createError(
  "MissingAuthorizationHeaderError",
  () => "Authorization header is required",
  {
    code: "MISSING_AUTHORIZATION_HEADER",
    error: "Unauthorized",
    statusCode: 401,
  },
);
