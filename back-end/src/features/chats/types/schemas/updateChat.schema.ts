import { chatSchema } from "./chat.schema";

export const updateChatSchema = chatSchema.pick({ chatId: true, type: true }).partial();
