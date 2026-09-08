import z from "zod";
import { budgetRecurringExpenseSchema } from "../schemas";

export type BudgetRecurringExpense = z.infer<
  typeof budgetRecurringExpenseSchema
>;
