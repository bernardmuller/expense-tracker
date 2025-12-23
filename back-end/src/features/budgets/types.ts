import { expenses, budgets } from "@/lib/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const transactionInsertSchema = createInsertSchema(expenses);
export const transactionSchema = createSelectSchema(expenses);

export const budgetInsertSchema = createInsertSchema(budgets);
export const budgetSchema = createSelectSchema(budgets);

export type Transaction = z.infer<typeof transactionSchema>;
export type Budget = z.infer<typeof budgetSchema>;

export type CategoryBudget = {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  category: {
    id: string;
    key: string;
    label: string;
    icon: string;
  };
};
