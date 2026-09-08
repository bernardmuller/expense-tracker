import z from "zod";
import { budgetSchema } from "../schemas";

export type Budget = z.infer<typeof budgetSchema>;
