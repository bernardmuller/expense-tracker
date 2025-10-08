import { Effect } from "effect";
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

export type CreateUserParams = Pick<User, "id" | "emailVerified" | "onboarded">;

export const markUserAsOnboarded = (
  user: User,
): Effect.Effect<User, UserAlreadyOnboardedError> =>
  Effect.gen(function* () {
    if (user.onboarded) {
      return yield* Effect.fail(
        new UserAlreadyOnboardedError({
          userId: user.id,
        }),
      );
    }

    return {
      ...user,
      onboarded: true,
    };
  });

export const markUserAsVerified = (
  user: User,
): Effect.Effect<User, UserAlreadyVerifiedError> =>
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

export const updateUser = (
  user: User,
  updatedUser: User,
): Effect.Effect<User, never> =>
  Effect.gen(function* () {
    return {
      ...user,
      name: updatedUser.name,
    };
  });

export const isUserFullySetup = (user: User): boolean =>
  user.onboarded && user.emailVerified;
