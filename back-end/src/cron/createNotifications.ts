import { db } from "@/lib/db";
import {
  chats,
  notificationPreferences,
  notifications,
  users,
} from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { generateUuid } from "@/lib/utils/generateUuid";

async function createNotifications() {
  const preferences = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.enabled, true));

  for (const p of preferences) {
    const pendingNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(isNull(notifications.sentAt), eq(notifications.userId, p.userId)),
      );
    if (pendingNotifications.length) continue;
    if (p.channel === "telegram") {
      const chat = await db
        .select()
        .from(chats)
        .leftJoin(users, eq(users.id, p.userId))
        .where(eq(chats.userId, p.userId));
      if (chat.length) {
        await db.insert(notifications).values({
          id: generateUuid(),
          userId: p.userId,
          channel: "telegram",
          message: `Hey, ${chat[0]?.users?.name}. If you spent any money today, this is your reminder to go log them on the Expenny app!`,
          createdAt: new Date(),
        });
      }
    }
  }
}

setInterval(createNotifications, 1000 * 20);
