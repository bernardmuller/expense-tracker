import z from "zod";
import { createChatSchema } from "../schemas";

export type CreateChatParams = z.infer<typeof createChatSchema>;
