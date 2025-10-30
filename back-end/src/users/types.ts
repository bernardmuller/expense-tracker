import { createError } from "@/lib/utils/createError";
import z from "zod";
import { createInsertSchema } from "drizzle-zod";
import { users } from "@/db/schema";

// --------------------------------
// Schemas & Types
// --------------------------------

export const userInsertSchema = createInsertSchema(users);

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  onboarded: z.boolean(),
  image: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.pick({
  name: true,
  email: true,
});

export type CreateUserParams = z.infer<typeof createUserSchema>;

// --------------------------------
// Errors
// --------------------------------

export const UserAlreadyOnboardedError = createError(
  "UserAlreadyOnboardedError",
  (userId: string) => `User ${userId} is already onboarded`,
  {
    code: "USER_ALREADY_ONBOARDED",
    error: "Conflict",
    statusCode: 409,
  },
);

export const UserAlreadyVerifiedError = createError(
  "UserAlreadyVerifiedError",
  (userId: string) => `User ${userId} is already verified`,
  {
    code: "USER_ALREADY_VERIFIED",
    error: "Conflict",
    statusCode: 409,
  },
);

export const UserAlreadyExistsError = createError(
  "UserAlreadyExistsError",
  (email: string) => `User with email: ${email} already exists`,
  {
    code: "USER_ALREADY_EXISTS",
    error: "Conflict",
    statusCode: 409,
  },
);

export const UserEmailAlreadyInUseError = createError(
  "UserEmailAlreadyInUseError",
  (email: string) => `User with email: ${email} already exists`,
  {
    code: "USER_EMAIL_ALREADY_IN_USE",
    error: "Validation Error",
    statusCode: 422,
  },
);

export type UserValidationError =
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof UserAlreadyExistsError>
  | InstanceType<typeof UserAlreadyVerifiedError>
  | InstanceType<typeof UserEmailAlreadyInUseError>;
