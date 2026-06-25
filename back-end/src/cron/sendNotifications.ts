import { db as defaultDb } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import env from "@/env";
import TelegramBot from "node-telegram-bot-api";
import { exit } from "node:process";

const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN);

async function send() {
  const chat = await defaultDb.select().from(chats);
  const chatId = chat[0]?.chatId;
  if (chatId) {
    await bot.sendMessage(chatId, "This is a message from a cron job! :D");
  }
  exit();
}

send();
