import z from "zod";
import { deleteExpenseParamsSchema } from "../schemas";

export type DeleteExpenseParams = z.infer<typeof deleteExpenseParamsSchema>;
