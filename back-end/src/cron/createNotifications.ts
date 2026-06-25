import { db } from "@/lib/db";
import {
  chats,
  notificationPreferences,
  notifications,
  users,
} from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { generateUuid } from "@/lib/utils/generateUuid";
import { NOTIFICATION_TYPES } from "@/lib/constants";

async function createNotifications() {
  const user_notification_preferences = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.enabled, true));

  for (const p of user_notification_preferences) {
    if (!p.enabled) continue;

    const pendingDaily = await db
      .select()
      .from(notifications)
      .where(
        and(
          isNull(notifications.sentAt),
          eq(notifications.userId, p.userId),
          eq(notifications.type, NOTIFICATION_TYPES.ACTIVITY_REMINDER),
        ),
      );

    if (p.channel === "telegram") {
      const chat = await db
        .select()
        .from(chats)
        .leftJoin(users, eq(users.id, p.userId))
        .where(eq(chats.userId, p.userId));
      if (chat.length) {
        if (!pendingDaily.length) {
          await db.insert(notifications).values({
            id: generateUuid(),
            userId: p.userId,
            type: NOTIFICATION_TYPES.ACTIVITY_REMINDER,
            channel: "telegram",
            message: `Hey, ${chat[0]?.users?.name}. If you spent any money today, this is your reminder to go log them on the Expenny app!`,
            createdAt: new Date(),
          });
        }
      }
    }
  }
}

setInterval(createNotifications, 1000 * 20);
