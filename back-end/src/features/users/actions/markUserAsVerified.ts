import { err, ok, type Result } from "neverthrow";
import type { User } from "../types";
import { ValidationError } from "@/lib/errors/domain";

export const markUserAsVerified = (
  user: User,
): Result<User, InstanceType<typeof ValidationError>> => {
  if (user.emailVerified) {
    return err(new ValidationError(`User's email is already verified`));
  }

  return ok({
    ...user,
    emailVerified: true,
  });
};
