import type { Context } from "hono";
import { db } from "@/lib/db";
import { chats, notifications } from "@/lib/db/schema";
import { bot } from "@/lib/telegram";
import { eq, isNull } from "drizzle-orm";

export async function sendNotificationsHandler(c: Context) {
  try {
    const ns = await db
      .select()
      .from(notifications)
      .leftJoin(chats, eq(chats.userId, notifications.userId))
      .where(isNull(notifications.sentAt));

    for (const n of ns) {
      const chatId = n.chats?.chatId;
      if (n.notifications.channel === "telegram" && chatId) {
        await bot.sendMessage(chatId, n.notifications.message);
        await db
          .update(notifications)
          .set({
            sentAt: new Date(),
          })
          .where(eq(notifications.id, n.notifications.id));
      }
    }

    return c.json({ message: "Notifications sent successfully" }, 200);
  } catch (err) {
    console.error("sendNotifications tick failed:", err);
    return c.json(
      {
        error: "Internal server error",
        message: "Failed to send notifications",
        code: "INTERNAL_SERVER_ERROR",
      },
      500,
    );
  }
}
