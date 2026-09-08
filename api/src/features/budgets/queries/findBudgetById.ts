import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findBudgetById = (
  budgetId: string,
  ctx: AppContext,
): AppResult<Budget, NotFoundError | DatabaseError> => {
  return fromDB(
    ctx.db.select().from(budgets).where(eq(budgets.id, budgetId)),
  ).andThen(([budget]) =>
    budget
      ? success(budget)
      : failure(new NotFoundError(`Budget: ${budgetId}`)),
  );
};
