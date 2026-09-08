import { budgets } from "@/lib/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const budgetSchema = createSelectSchema(budgets);
