import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const update = (
  user: User,
  ctx: AppContext,
): AppResult<User, DatabaseError> =>
  fromDB(
    ctx.db
      .update(users)
      .set({
        ...user,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning(),
  ).andThen(([updatedUser]) =>
    updatedUser
      ? success(updatedUser)
      : failure(new DatabaseError("Failed to update user")),
  );
