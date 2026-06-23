import z from "zod";
import { updateChatSchema } from "../schemas";

export type UpdateChatParams = z.infer<typeof updateChatSchema>;
