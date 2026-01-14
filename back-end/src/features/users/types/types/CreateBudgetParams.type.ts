import z from "zod";
import { createBudgetSchema } from "../schemas";

export type CreateBudgetParams = z.infer<typeof createBudgetSchema>;
