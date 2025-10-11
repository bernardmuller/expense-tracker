import { Effect } from "effect";
import {
  type UserValidationError,
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "./userErrors";
import { generateUuid } from "@/lib/utils/generateUuid";
import { ok } from "neverthrow";

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

export const markUserAsOnboarded = (user: User) =>
  Effect.gen(function* () {
    if (user.onboarded) {
      return yield* Effect.fail(
        new UserAlreadyOnboardedError({
          userId: user.id,
        }),
      );

    return {
      ...user,
      onboarded: true,
    } satisfies User;
  });

export const markUserAsVerified = (user: User) =>
  Effect.gen(function* () {
    if (user.emailVerified) {
      return yield* Effect.fail(
        new UserAlreadyVerifiedError({
     userId: user.id,
        }),
      );
    }

    return {
      ...user,
      emailVerified: true,
    };
  });

export const updateUser = (user: User, updatedUser: User) =>
  Effect.gen(function* () {
    return {
      ...user,
      name: updatedUser.name,
    };
  });

export const isUserFullySetup = (user: User) =>
  user.onboarded && user.emailVerified;
