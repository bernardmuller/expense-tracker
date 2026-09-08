import type { AppContext } from "@/lib/db/context";
import { userPreferences } from "@/lib/db/schema";
import type { UserPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const updatePreferences = (
  userId: string,
  preferences: Partial<UserPreferences>,
  ctx: AppContext,
): AppResult<UserPreferences, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .update(userPreferences)
      .set({
        ...preferences,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId))
      .returning(),
  ).andThen(([updatedPrefs]) =>
    updatedPrefs
      ? success(updatedPrefs)
      : failure(new NotFoundError(`UserPreferences: ${userId}`)),
  );
