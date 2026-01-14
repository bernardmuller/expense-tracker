import type { AppContext } from "@/lib/db/context";
import { userPreferences } from "@/lib/db/schema";
import type { UserPreferences } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export const findPreferencesByUserId = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId)),
    (error) => new EntityReadError("UserPreferences", String(error)),
  ).andThen(([prefs]) =>
    prefs
      ? okAsync(prefs)
      : errAsync(new EntityNotFoundError(`UserPreferences: ${userId}`)),
  );
