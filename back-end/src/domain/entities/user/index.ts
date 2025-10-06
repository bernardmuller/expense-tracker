import { getCurrentISOString } from "@/lib/utils/time";
import { Effect } from "effect";
import {
  UserAlreadySoftDeletedError,
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "./userErrors";

export type User = {
  readonly id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  onboarded: boolean;
  deletedAt?: string;
  updatedAt?: string;
};

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

    const now = getCurrentISOString();

    return {
      ...user,
      onboarded: true,
      updatedAt: now,
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

    const now = getCurrentISOString();

    return {
      ...user,
      emailVerified: true,
      updatedAt: now,
    };
  });

export const updateUserProfile = (
  user: User,
  updatedUser: User,
): Effect.Effect<User, never> =>
  Effect.gen(function* () {
    const now = getCurrentISOString();

    return {
      ...user,
      name: updatedUser.name,
      updatedAt: now,
    };
  });

export const isUserFullySetup = (user: User): boolean =>
  user.onboarded && user.emailVerified;

export const isUserSoftDeleted = (user: User): boolean => !!user.deletedAt;

export const softDeleteUser = (
  user: User,
): Effect.Effect<User, UserAlreadySoftDeletedError> =>
  Effect.gen(function* () {
    if (user.deletedAt) {
      return yield* Effect.fail(
        new UserAlreadySoftDeletedError({
          userId: user.id,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...user,
      deletedAt: now,
    };
  });
