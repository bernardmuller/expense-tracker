import { err, ok, type Result } from "neverthrow";
import type { User } from "@/lib/db/schema";
import { ValidationError } from "@/lib/errors/domain";

export const markUserAsOnboarded = (
  user: User,
): Result<User, InstanceType<typeof ValidationError>> => {
  if (user.onboarded) {
    return err(new ValidationError("User already onboarded"));
  }

  return ok({
    ...user,
    onboarded: true,
  });
};
