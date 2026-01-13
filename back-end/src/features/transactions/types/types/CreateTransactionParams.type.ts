import z from "zod";
import { createTransactionSchema } from "../schemas";

export type CreateTransactionParams = z.infer<typeof createTransactionSchema>;
