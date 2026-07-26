import TelegramBot from "node-telegram-bot-api";
import env from "../../env";
import { db as defaultDb, type DB } from "@/lib/db";
import { eq } from "drizzle-orm";
import { accounts, chats, users, verifications } from "../db/schema";
import { generateUuid } from "../utils/generateUuid";

const token = env.TELEGRAM_BOT_TOKEN;
export const bot = new TelegramBot(token, { polling: true });

bot.onText(
  /\/start ([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/,
  async (msg) => {
    const verificationId = msg.text?.split(" ")[1];

    try {
      const verification = await defaultDb
        .select()
        .from(verifications)
        .where(eq(verifications.identifier, verificationId));
      if (verification.length === 0) {
        bot.sendMessage(msg.chat.id, "No verification found.");
        return;
      }

      const user_verification = verification[0]!;

      if (user_verification.expiresAt < new Date()) {
        bot.sendMessage(msg.chat.id, "Verification link has expired.");
        return;
      }

      const user = await defaultDb
        .select()
        .from(users)
        .where(eq(users.id, user_verification.value.toString()));
      if (user.length === 0) {
        bot.sendMessage(msg.chat.id, "Could not find your account.");
        return;
      }

      const foundUser = user[0]!;
      const now = new Date();

      await defaultDb.insert(chats).values({
        id: generateUuid(),
        userId: foundUser.id,
        chatId: msg.chat.id.toString(),
        type: "telegram",
        createdAt: now,
        updatedAt: now,
      });

      await defaultDb
        .delete(verifications)
        .where(eq(verifications.identifier, verificationId!));

      bot.sendMessage(
        msg.chat.id,
        "Your Telegram account has been linked successfully!",
      );
    } catch (err) {
      console.error("Error handling /start verification:", err);
      bot.sendMessage(msg.chat.id, "Something went wrong. Please try again.");
    }
  },
);

bot.onText("Hello", (msg) => {
  console.log(msg.text);
});
