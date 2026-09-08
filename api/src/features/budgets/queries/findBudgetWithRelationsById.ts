import type { AppContext } from "@/lib/db/context";
import { expenses, budgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export type BudgetWithRelations = Budget & {
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
  categoryBudgets: Array<{
    id: string;
    budgetId: string;
    categoryId: string;
    allocatedAmount: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    category: { id: string; key: string; label: string; icon: string };
  }>;
};

export const findBudgetWithRelationsById = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): AppResult<BudgetWithRelations, NotFoundError | DatabaseError> => {
  return fromDB(
    ctx.db.query.budgets.findFirst({
      where: and(eq(budgets.id, budgetId), eq(budgets.userId, userId)),
      with: {
        expenses: {
          orderBy: desc(expenses.createdAt),
          with: {
            category: true,
          },
        },
        categoryBudgets: {
          with: {
            category: true,
          },
        },
      },
    }),
  ).andThen((budget) =>
    budget
      ? success(budget as BudgetWithRelations)
      : failure(new NotFoundError(`Budget ${budgetId} for user ${userId}`)),
  );
};
