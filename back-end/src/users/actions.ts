import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok, type Result } from "neverthrow";
import type { CreateUserParams, User } from "./types";
import { UserAlreadyOnboardedError, UserAlreadyVerifiedError } from "./types";

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
  // Only allow updating name and image, preserve all other fields
  return ok({
    ...user,
    name: updates.name ?? user.name,
    image: updates.image !== undefined ? updates.image : user.image,
  });
};

export const isUserFullySetup = (user: User): boolean =>
  user.onboarded && user.emailVerified;
