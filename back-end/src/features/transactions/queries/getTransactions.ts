import type { AppContext } from "@/lib/db/context";
import { expenses, budgets, categories } from "@/lib/db/schema";
import { eq, like } from "drizzle-orm";
import type { Transaction } from "../types";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const getTransactions = (
  search: SearchQueries<
    Transaction,
    {
      budgetId: string;
      categoryId: string;
      userId: string;
      description: string;
    }
  >,
  ctx: AppContext,
): AppResult<Array<Transaction>, DatabaseError> => {
  const includesCategory = search.include?.includes("category");

  const baseSelect = {
    id: expenses.id,
    budgetId: expenses.budgetId,
    description: expenses.description,
    amount: expenses.amount,
    note: expenses.note,
    categoryId: expenses.categoryId,
    createdAt: expenses.createdAt,
    updatedAt: expenses.updatedAt,
    deletedAt: expenses.deletedAt,
  };

  const selectWithCategory = {
    ...baseSelect,
    category: {
      id: categories.id,
      key: categories.key,
      label: categories.label,
      icon: categories.icon,
    },
  };

  const queryBuilder = includesCategory
    ? ctx.db.select(selectWithCategory).from(expenses)
    : ctx.db.select(baseSelect).from(expenses);

  return fromDB(
    buildDrizzleQuery(
      queryBuilder,
      search,
      {
        budgetId: (value) => eq(expenses.budgetId, value),
        categoryId: (value) => eq(expenses.categoryId, value),
        userId: (value) => eq(budgets.userId, value),
        description: (value) => like(expenses.description, `%${value}%`),
      },
      {
        createdAt: expenses.createdAt,
      },
      {
        category: {
          table: categories,
          on: eq(expenses.categoryId, categories.id),
          fields: {
            id: categories.id,
            key: categories.key,
            label: categories.label,
            icon: categories.icon,
          },
        },
      },
    ),
  );
};
