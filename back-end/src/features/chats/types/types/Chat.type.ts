import z from "zod";
import { chatSchema } from "../schemas";

export type Chat = z.infer<typeof chatSchema>;
