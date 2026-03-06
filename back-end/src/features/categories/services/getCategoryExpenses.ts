import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import * as CategoryRepo from "../repositories";

type ExpenseWithCategory = {
  id: string;
  budgetId: string;
  description: string;
  amount: string;
  note: string | null;
  categoryId: string;
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

export const getCategoryExpenses = (
  userId: string,
  categoryId: string,
  options: {
    limit?: number;
    offset?: number;
    sort?: "createdAt" | "-createdAt";
  },
  ctx: AppContext,
): AppResult<{ expenses: ExpenseWithCategory[]; count: number }> => {
  return CategoryRepo.getCategoryExpenses(userId, categoryId, options, ctx).map(
    (expenses) => ({
      expenses,
      count: expenses.length,
    }),
  );
};
