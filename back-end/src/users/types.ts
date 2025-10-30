import { generateUuid } from "@/lib/utils/generateUuid";
import { createError } from "@/lib/utils/createError";
import { err, ok, type Result } from "neverthrow";
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

// --------------------------------
// Domain Functions
// --------------------------------

export const createUser = (params: CreateUserParams): Result<User, never> => {
  const uuid = generateUuid();
  return ok({
    id: uuid,
    ...params,
    emailVerified: false,
    onboarded: false,
  });
};

export const markUserAsOnboarded = (
  user: User,
): Result<User, InstanceType<typeof UserAlreadyOnboardedError>> => {
  if (user.onboarded) {
    return err(new UserAlreadyOnboardedError(user.id));
  }

  return ok({
    ...user,
    onboarded: true,
  });
};

export const markUserAsVerified = (
  user: User,
): Result<User, InstanceType<typeof UserAlreadyVerifiedError>> => {
  if (user.emailVerified) {
    return err(new UserAlreadyVerifiedError(user.id));
  }

  return ok({
    ...user,
    emailVerified: true,
  });
};

export const updateUser = (
  user: User,
  updates: Partial<User>,
): Result<User, never> => {
  return ok({
    ...user,
    ...updates,
  });
};

export const isUserFullySetup = (user: User): boolean =>
  user.onboarded && user.emailVerified;
