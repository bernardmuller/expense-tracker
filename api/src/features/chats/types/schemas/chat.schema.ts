import { createSelectSchema } from "drizzle-zod";
import { chats } from "@/lib/db/schema";

export const chatSchema = createSelectSchema(chats);
