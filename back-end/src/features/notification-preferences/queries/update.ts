import type { AppContext } from "@/lib/db/context";
import { notificationPreferences } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import type { UpdateNotificationPreferenceParams, NotificationPreference } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const update = (
  id: string,
  userId: string,
  params: UpdateNotificationPreferenceParams,
  ctx: AppContext,
): AppResult<NotificationPreference, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .update(notificationPreferences)
      .set({ ...params, updatedAt: new Date() })
      .where(and(eq(notificationPreferences.id, id), eq(notificationPreferences.userId, userId)))
      .returning(),
  ).andThen(([updated]) =>
    updated
      ? success(updated)
      : failure(new NotFoundError(`NotificationPreference: ${id}`)),
  );
