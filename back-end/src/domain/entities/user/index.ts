import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";
import {
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "./userErrors";

export type User = {
  readonly id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  onboarded: boolean;
};

export type CreateUserParams = Omit<User, "id" | "emailVerified" | "onboarded">;

export const createUser = (params: CreateUserParams) => {
  const uuid = generateUuid();
  return ok({
    id: uuid,
    ...params,
    emailVerified: false,
    onboarded: false,
  });
};

export const markUserAsOnboarded = (user: User) => {
  if (user.onboarded) {
    return err(new UserAlreadyOnboardedError(user.id));
  }

  return ok({
    ...user,
    onboarded: true,
  } satisfies User);
};

export const markUserAsVerified = (user: User) => {
  if (user.emailVerified) {
    return err(new UserAlreadyVerifiedError(user.id));
  }

  return ok({
    ...user,
    emailVerified: true,
  });
};

export const updateUser = (user: User, updatedUser: User) => {
  return ok({
    ...user,
    name: updatedUser.name,
  });
};

export const isUserFullySetup = (user: User) =>
  user.onboarded && user.emailVerified;
