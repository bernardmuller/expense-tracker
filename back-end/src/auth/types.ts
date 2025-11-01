import z, { email } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { users, accounts } from "@/db/schema";
import { validateEmail } from "@/lib/validations/emailValidator";
import { validateName } from "@/lib/validations/nameValidator";
import {
  validatePasswordLength,
  validatePasswordHasUppercase,
  validatePasswordHasLowercase,
  validatePasswordHasSpecialChar,
  validatePasswordHasNumber,
} from "@/lib/validations/passwordValidator";
import { createError } from "@/lib/utils/createError";

export const userInsertSchema = createInsertSchema(users);
export const accountInsertSchema = createInsertSchema(accounts);

const userSchemaBase = userInsertSchema.pick({
  name: true,
  email: true,
});

export const registerUserAndAccountSchema = userSchemaBase
  .extend({
    password: accountInsertSchema.shape.password,
  })
  .refine((val) => validateEmail(val.email), {
    message: "Invalid email",
    path: ["email"],
  })
  .refine((val) => validateName(val.name), {
    message: "Invalid name",
    path: ["name"],
  })
  .refine((val) => validatePasswordLength(val.password), {
    message: "Password must be at least 12 characters",
    path: ["password"],
  })
  .refine((val) => validatePasswordHasUppercase(val.password), {
    message: "Password must contain at least one uppercase letter",
    path: ["password"],
  })
  .refine((val) => validatePasswordHasNumber(val.password), {
    message: "Password must contain at least one number",
    path: ["password"],
  })
  .refine((val) => validatePasswordHasLowercase(val.password), {
    message: "Password must contain at least one lowercase letter",
    path: ["password"],
  })
  .refine((val) => validatePasswordHasSpecialChar(val.password), {
    message: "Password must contain at least one special character",
    path: ["password"],
  });

export type RegisterUserAndAccountParams = z.infer<
  typeof registerUserAndAccountSchema
>;

// Magic link login - only email required
export const loginRequestSchema = userInsertSchema
  .pick({
    email: true,
  })
  .refine((val) => validateEmail(val.email), {
    message: "Invalid email",
    path: ["email"],
  });

export type LoginRequestParams = z.infer<typeof loginRequestSchema>;

// Traditional email and password login
export const loginEmailAndPasswordSchema = userInsertSchema
  .pick({
    email: true,
  })
  .extend({
    password: accountInsertSchema.shape.password,
  })
  .refine((val) => validateEmail(val.email), {
    message: "Invalid email",
    path: ["email"],
  });

export type LoginEmailAndPasswordParams = z.infer<typeof loginEmailAndPasswordSchema>;

// Alias for LoginRequestParams to match operation naming
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

export const PasswordHashError = createError(
  "PasswordHashError",
  (message: string) => `Failed to hash password: ${message}`,
  {
    code: "PASSWORD_HASH_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const OTPHashError = createError(
  "OTPHashError",
  (message: string) => `Failed to hash otp: ${message}`,
  {
    code: "OTP_HASH_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const PasswordCompareError = createError(
  "PasswordCompareError",
  (message: string) => `Failed to compare password: ${message}`,
  {
    code: "PASSWORD_COMPARE_FAILED",
    error: "Internal Server Error",
    statusCode: 500,
  },
);

export const IncorrectPasswordError = createError(
  "IncorrectPasswordError",
  () => "The email or password is incorrect",
  {
    code: "INCORRECT_PASSWORD",
    error: "Unauthorized",
    statusCode: 401,
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
