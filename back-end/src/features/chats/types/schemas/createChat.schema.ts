import { chatSchema } from "./chat.schema";

export const createChatSchema = chatSchema.pick({
  userId: true,
  chatId: true,
  type: true,
});
