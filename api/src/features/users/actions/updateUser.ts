import { ok, type Result } from "neverthrow";
import type { User } from "../types";

export const updateUser = (
  user: User,
  updates: Partial<User>,
): Result<User, never> => {
  // Only allow updating name and image, preserve all other fields
  return ok({
    ...user,
    name: updates.name ?? user.name,
    image: updates.image !== undefined ? updates.image : user.image,
  });
};
