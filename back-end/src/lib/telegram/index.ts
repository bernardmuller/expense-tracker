import TelegramBot from 'node-telegram-bot-api'
import env from "../../env"
import { db as defaultDb, type DB } from "@/lib/db";
import { and, eq } from 'drizzle-orm';
import { accounts, users, verifications } from '../db/schema';

const token = env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start ([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/, async (msg) => {
	console.log("Received message from chat: ", msg.chat.id)
	const secret = msg.text?.split(" ")[1]

	const verification = await defaultDb.select().from(verifications).where(eq(verifications.identifier, secret))
	if (verification.length === 0) {
		bot.sendMessage(msg.chat.id, "No verification found.")
		return
	}

	const user_verification = verification[0];

	const user = await defaultDb.select().from(users).where(eq(users.id, user_verification?.value.toString()))
	if (user.length === 0) {
		bot.sendMessage(msg.chat.id, "Could not find your account.")
		return
	}


	bot.sendMessage(msg.chat.id, `User id: ${user[0]?.id}`)
});
