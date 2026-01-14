import { err, ok, type Result } from "neverthrow";
import type { User } from "../types";
import { UserAlreadyOnboardedError } from "../types";

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
