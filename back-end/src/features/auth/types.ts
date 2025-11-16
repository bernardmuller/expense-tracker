import { accounts, users } from "@/lib/db/schema";
import { createError } from "@/lib/utils/createError";
import { validateEmail } from "@/lib/validations/emailValidator";
import { validateName } from "@/lib/validations/nameValidator";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);
export const accountInsertSchema = createInsertSchema(accounts);

const userSchemaBase = userInsertSchema.pick({
  name: true,
  email: true,
});

export const registerRequestSchema = userInsertSchema
  .pick({
    name: true,
    email: true,
  })
  .refine((val) => validateEmail(val.email), {
    message: "Invalid email",
    path: ["email"],
  })
  .refine((val) => validateName(val.name), {
    message: "Invalid name",
    path: ["name"],
  });

export type RegisterRequestParams = z.infer<typeof registerRequestSchema>;

export const registerVerifySchema = userSelectSchema;

export const registerVerifyParamsSchema = z.object({
  otp: z.string(),
});

export type RegisterVerifyParams = z.infer<typeof registerVerifyParamsSchema>;

export const loginRequestSchema = userInsertSchema
  .pick({
    email: true,
  })
  .refine((val) => validateEmail(val.email), {
    message: "Invalid email",
    path: ["email"],
  });

export type LoginRequestParams = z.infer<typeof loginRequestSchema>;

export type LoginParams = LoginRequestParams;

export const loginAttemptSchema = z.object({
  otp: z.string(),
});

export type LoginAttemptParams = z.infer<typeof loginAttemptSchema> & {
  token: string;
};

export const loginResponseSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const loginRequestResponseSchema = z.object({
  token: z.string(),
});

export type LoginRequestResponse = z.infer<typeof loginRequestResponseSchema>;

// --------------------------------
// Errors
// --------------------------------

export const OTPHashError = createError(
  "OTPHashError",
  (message: string) => `Failed to hash otp: ${message}`,
  {
    code: "OTP_HASH_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const JwtGenerationError = createError(
  "JwtGenerationError",
  (message: string) => `Failed to generate JWT: ${message}`,
  {
    code: "JWT_GENERATION_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const InvalidEmailAndOrPasswordError = createError(
  "InvalidEmailAndOrPasswordError",
  () => `Invalid email and/or password`,
  {
    code: "INVALID_EMAIL_AND_OR_PASSWORD",
    error: "Invalid email and/or password",
    statusCode: 401,
  },
);

export const OTPCompareError = createError(
  "OTPCompareError",
  (message: string) => `Failed to compare OTP: ${message}`,
  {
    code: "OTP_COMPARE_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const InvalidOTPError = createError(
  "InvalidOTPError",
  () => "The OTP provided is incorrect",
  {
    code: "INVALID_OTP",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const VerificationExpiredError = createError(
  "VerificationExpiredError",
  () => "The verification code has expired",
  {
    code: "VERIFICATION_EXPIRED",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const InvalidVerificationTokenError = createError(
  "InvalidVerificationTokenError",
  (message: string) => `Invalid verification token: ${message}`,
  {
    code: "INVALID_VERIFICATION_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const VerificationNotFoundError = createError(
  "VerificationNotFoundError",
  () => "Verification record not found",
  {
    code: "VERIFICATION_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);

export const OTPGenerationError = createError(
  "OTPGenerationError",
  (message: string) => `Failed to generate OTP: ${message}`,
  {
    code: "OTP_GENERATION_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const VerificationCreationError = createError(
  "VerificationCreationError",
  (message: string) => `Failed to create verification: ${message}`,
  {
    code: "VERIFICATION_CREATION_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const MissingAuthorizationHeaderError = createError(
  "MissingAuthorizationHeaderError",
  () => "Authorization header is required",
  {
    code: "MISSING_AUTHORIZATION_HEADER",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const InvalidAuthorizationHeaderError = createError(
  "InvalidAuthorizationHeaderError",
  () => "Authorization header must be in format: Bearer <token>",
  {
    code: "INVALID_AUTHORIZATION_HEADER",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const ExpiredRefreshTokenError = createError(
  "ExpiredRefreshTokenError",
  () => "Refresh token has expired",
  {
    code: "EXPIRED_REFRESH_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const InvalidRefreshTokenError = createError(
  "InvalidRefreshTokenError",
  () => "Refresh token is invalid or malformed",
  {
    code: "INVALID_REFRESH_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const RefreshTokenDecodeError = createError(
  "RefreshTokenDecodeError",
  (message: string) => `Failed to decode refresh token: ${message}`,
  {
    code: "REFRESH_TOKEN_DECODE_FAILED",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const ExpiredAccessTokenError = createError(
  "ExpiredAccessTokenError",
  () => "Access token has expired",
  {
    code: "EXPIRED_ACCESS_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const InvalidAccessTokenError = createError(
  "InvalidAccessTokenError",
  () => "Access token is invalid or malformed",
  {
    code: "INVALID_ACCESS_TOKEN",
    error: "Unauthorized",
    statusCode: 401,
  },
);

export const AccessTokenDecodeError = createError(
  "AccessTokenDecodeError",
  (message: string) => `Failed to decode access token: ${message}`,
  {
    code: "ACCESS_TOKEN_DECODE_FAILED",
    error: "Unauthorized",
    statusCode: 401,
  },
);
