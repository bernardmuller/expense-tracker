import { expenses } from "@/lib/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const transactionInsertSchema = createInsertSchema(expenses);
export const transactionSchema = createSelectSchema(expenses);

export type Transaction = z.infer<typeof transactionSchema>;

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
