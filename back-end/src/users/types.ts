import { createError } from "@/lib/utils/createError";
import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "@/db/schema";

// --------------------------------
// Schemas & Types
// --------------------------------

export const userInsertSchema = createInsertSchema(users);
export const userSchema = createSelectSchema(users);

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

export type UserValidationError =
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof UserAlreadyExistsError>
  | InstanceType<typeof UserAlreadyVerifiedError>;
