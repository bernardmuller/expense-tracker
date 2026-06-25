import { db } from "@/lib/db";
import { chats, notifications } from "@/lib/db/schema";
import env from "@/env";
import TelegramBot from "node-telegram-bot-api";
import { eq, isNull } from "drizzle-orm";

const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN);

async function sendNotifications() {
  const ns = await db
    .select()
    .from(notifications)
    .leftJoin(chats, eq(chats.userId, notifications.userId))
    .where(isNull(notifications.sentAt));
  for (const n of ns) {
    const chatId = n.chats?.chatId;
    if (n.notifications.channel === "telegram" && chatId) {
      bot.sendMessage(chatId, n.notifications.message);
    }
  }
}

setInterval(sendNotifications, 1000 * 20);
