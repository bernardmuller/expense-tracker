import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import { EntityUpdateError } from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { User } from "../types";

export const update = (
  user: User,
  ctx: AppContext,
): ResultAsync<User, InstanceType<typeof EntityUpdateError>> =>
  ResultAsync.fromPromise(
    ctx.db
      .update(users)
      .set({
        ...user,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning(),
    (error) => new EntityUpdateError("User", error),
  ).andThen(([updatedUser]) =>
    updatedUser
      ? okAsync(updatedUser)
      : errAsync(new EntityUpdateError("User")),
  );
