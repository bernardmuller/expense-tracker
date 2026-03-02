import type { AppContext } from "@/lib/db/context";
import { expenses, budgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

type BudgetWithExpenses = Budget & {
  expenses: Array<{
    id: string;
    budgetId: string;
    description: string;
    amount: string;
    categoryId: string;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    category: { id: string; key: string; label: string; icon: string };
  }>;
};

export const findActiveBudgetWithExpenses = (
  userId: string,
  ctx: AppContext,
): AppResult<BudgetWithExpenses, NotFoundError | DatabaseError> => {
  return fromDB(
    ctx.db.query.budgets.findFirst({
      where: and(eq(budgets.userId, userId), eq(budgets.isActive, true)),
      with: {
        expenses: {
          orderBy: desc(expenses.createdAt),
          with: {
            category: true,
          },
        },
      },
    }),
  ).andThen((budget) =>
    budget
      ? success(budget as BudgetWithExpenses)
      : failure(new NotFoundError(`Active budget for user ${userId}`)),
  );
};
