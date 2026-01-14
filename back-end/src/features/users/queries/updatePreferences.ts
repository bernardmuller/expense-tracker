import type { AppContext } from "@/lib/db/context";
import { userPreferences } from "@/lib/db/schema";
import type { UserPreferences } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export const updatePreferences = (
  userId: string,
  preferences: Partial<UserPreferences>,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityUpdateError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .update(userPreferences)
      .set({
        ...preferences,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId))
      .returning(),
    (error) => new EntityUpdateError("UserPreferences", error),
  ).andThen(([updatedPrefs]) =>
    updatedPrefs
      ? okAsync(updatedPrefs)
      : errAsync(new EntityNotFoundError(`UserPreferences: ${userId}`)),
  );
