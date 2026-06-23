import TelegramBot from 'node-telegram-bot-api'
import env from "../../env"
import { db as defaultDb, type DB } from "@/lib/db";
import { and, eq } from 'drizzle-orm';
import { accounts } from '../db/schema';

const token = env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start/, async (msg) => {
	console.log("Received message from chat: ", msg.chat.id)
	const account = await defaultDb.select().from(accounts).where(eq(accounts.accessToken, msg.chat.id.toString()))
	if (account.length === 0) {
		bot.sendMessage(msg.chat.id, "No account found.")
	}
});
