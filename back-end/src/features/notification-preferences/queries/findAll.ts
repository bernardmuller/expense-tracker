import type { AppContext } from "@/lib/db/context";
import { notificationPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NotificationPreference } from "../types";
import type { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export type NotificationPreferenceFilters = {
  userId: string;
  type: string;
  channel: string;
  enabled: boolean;
};

export const findAll = (
  search: SearchQueries<NotificationPreference, NotificationPreferenceFilters>,
  ctx: AppContext,
): AppResult<NotificationPreference[], DatabaseError> => {
  const queryBuilder = ctx.db.select().from(notificationPreferences);

  return fromDB(
    buildDrizzleQuery(
      queryBuilder,
      search,
      {
        userId: (value) => eq(notificationPreferences.userId, value),
        type: (value) => eq(notificationPreferences.type, value),
        channel: (value) => eq(notificationPreferences.channel, value),
        enabled: (value) => eq(notificationPreferences.enabled, value),
      },
      { createdAt: notificationPreferences.createdAt },
    ),
  );
};
