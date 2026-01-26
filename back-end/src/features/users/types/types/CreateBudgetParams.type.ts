import z from "zod";
import { createBudgetSchema } from "../schemas";

export { createBudgetSchema };
export type CreateBudgetParams = z.infer<typeof createBudgetSchema>;
