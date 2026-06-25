import type { AppContext } from "@/lib/db/context";
import { notificationPreferences } from "@/lib/db/schema";
import type { CreateNotificationPreferenceParams, NotificationPreference } from "../types";
import { generateUuid } from "@/lib/utils/generateUuid";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const create = (
  userId: string,
  params: CreateNotificationPreferenceParams,
  ctx: AppContext,
): AppResult<NotificationPreference, DatabaseError> =>
  fromDB(
    ctx.db
      .insert(notificationPreferences)
      .values({
        id: generateUuid(),
        userId,
        type: params.type,
        channel: params.channel,
        enabled: params.enabled ?? true,
        scheduledAt: params.scheduledAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning(),
  ).andThen(([created]) =>
    created
      ? success(created)
      : failure(new DatabaseError("Failed to create notification preference")),
  );
