import type { AppContext } from "@/lib/db/context";
import { expenses, budgets, categories } from "@/lib/db/schema";
import { eq, and, isNull, desc, asc } from "drizzle-orm";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

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
): AppResult<ExpenseWithCategory[], DatabaseError> => {
  const { limit = 100, offset = 0, sort = "-createdAt" } = options;
  const orderByClause =
    sort === "createdAt" ? asc(expenses.createdAt) : desc(expenses.createdAt);

  return fromDB(
    ctx.db
      .select({
        id: expenses.id,
        budgetId: expenses.budgetId,
        description: expenses.description,
        amount: expenses.amount,
        note: expenses.note,
        categoryId: expenses.categoryId,
        createdAt: expenses.createdAt,
        updatedAt: expenses.updatedAt,
        deletedAt: expenses.deletedAt,
        category: {
          id: categories.id,
          key: categories.key,
          label: categories.label,
          icon: categories.icon,
        },
      })
      .from(expenses)
      .innerJoin(budgets, eq(expenses.budgetId, budgets.id))
      .innerJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(budgets.userId, userId),
          eq(expenses.categoryId, categoryId),
          isNull(expenses.deletedAt),
        ),
      )
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset),
  );
};
