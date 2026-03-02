import type { AppContext } from "@/lib/db/context";
import { userPreferences } from "@/lib/db/schema";
import type { UserPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findPreferencesByUserId = (
  userId: string,
  ctx: AppContext,
): AppResult<UserPreferences, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId)),
  ).andThen(([prefs]) =>
    prefs
      ? success(prefs)
      : failure(new NotFoundError(`UserPreferences: ${userId}`)),
  );
