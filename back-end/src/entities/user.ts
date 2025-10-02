import { Effect } from "effect";

export type User = {
  readonly id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  onboarded: boolean;
  deletedAt?: string;
};

export function markUserAsOnboarded(user: User): User {
  return {
    ...user,
    onboarded: true,
  };
}

export function markUserAsVerified(user: User): User {
  return {
    ...user,
    emailVerified: true,
  };
}

export function updateUserProfile(user: User, updatedUser: User): User {
  return {
    ...user,
    name: updatedUser.name,
  };
}

export function isUserFullySetup(user: User): boolean {
  return user.onboarded && user.emailVerified;
}

export function softDeleteUser(user: User): Effect.Effect<User, Error, User> {
  return Effect.succeed({
    ...user,
    deletedAt: new Date().toLocaleString(),
  });
}
