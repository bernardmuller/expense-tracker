import type { AppContext } from "@/lib/db/context";
import { budgetRecurringExpenses } from "@/lib/db/schema";
import { and, asc, eq, isNull } from "drizzle-orm";
import type { BudgetRecurringExpense } from "../types";
import { AppResult, fromDB, success } from "@/lib/result";
import type { DatabaseError } from "@/lib/errors/domain";

export type BudgetRecurringExpenseWithRelations = BudgetRecurringExpense & {
  category: {
    id: string;
    key: string;
    label: string;
    icon: string;
  } | null;
  expense: {
    id: string;
    description: string;
    amount: string;
    categoryId: string;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } | null;
};

export const findInstancesByBudgetId = (
  budgetId: string,
  ctx: AppContext,
): AppResult<BudgetRecurringExpenseWithRelations[], DatabaseError> =>
  fromDB(
    ctx.db.query.budgetRecurringExpenses.findMany({
      where: and(
        eq(budgetRecurringExpenses.budgetId, budgetId),
        isNull(budgetRecurringExpenses.deletedAt),
      ),
      orderBy: asc(budgetRecurringExpenses.createdAt),
      with: {
        category: true,
        expense: true,
      },
    }),
  ).andThen((rows) => success(rows as BudgetRecurringExpenseWithRelations[]));
