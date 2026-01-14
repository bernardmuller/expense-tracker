import type { User } from "../types";

export const isUserFullySetup = (user: User): boolean =>
  user.onboarded && user.emailVerified;
