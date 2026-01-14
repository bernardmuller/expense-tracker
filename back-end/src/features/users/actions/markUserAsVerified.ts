import { err, ok, type Result } from "neverthrow";
import type { User } from "../types";
import { UserAlreadyVerifiedError } from "../types";

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
