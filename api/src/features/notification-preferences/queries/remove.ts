import type { AppContext } from "@/lib/db/context";
import { notificationPreferences } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import type { NotificationPreference } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const remove = (
  id: string,
  userId: string,
  ctx: AppContext,
): AppResult<NotificationPreference, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .delete(notificationPreferences)
      .where(and(eq(notificationPreferences.id, id), eq(notificationPreferences.userId, userId)))
      .returning(),
  ).andThen(([deleted]) =>
    deleted
      ? success(deleted)
      : failure(new NotFoundError(`NotificationPreference: ${id}`)),
  );
