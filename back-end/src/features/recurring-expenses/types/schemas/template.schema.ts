import { createSelectSchema } from "drizzle-zod";
import { recurringExpenseTemplates } from "@/lib/db/schema";

export const recurringExpenseTemplateSchema = createSelectSchema(
  recurringExpenseTemplates,
);
