import { createInsertSchema } from "drizzle-zod";
import { chats } from "@/lib/db/schema";

export const chatInsertSchema = createInsertSchema(chats);
