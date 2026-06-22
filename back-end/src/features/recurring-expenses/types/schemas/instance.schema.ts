import { createSelectSchema } from "drizzle-zod";
import { budgetRecurringExpenses } from "@/lib/db/schema";

export const budgetRecurringExpenseSchema = createSelectSchema(
  budgetRecurringExpenses,
);
