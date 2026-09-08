import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";
import { getNotificationPreferences } from "../services";
import type { NotificationPreference } from "../types";

export const getNotificationPreferencesHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };

  return parseSearchQuery<NotificationPreference, { type: string; channel: string; enabled: boolean }>({
    rawQuery: c.req.query(),
    allowedSortKeys: ["createdAt"],
    filterKeys: ["type", "channel", "enabled"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return getNotificationPreferences(user.userId, search, ctx);
    })
    .match(
      (notificationPreferences) =>
        c.json({ notificationPreferences, count: notificationPreferences.length }, 200),
      (error) => mapErrorToResponse(error, c),
    );
};
