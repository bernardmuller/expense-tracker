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

export const loginSchema = userInsertSchema
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

export type LoginParams = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

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
