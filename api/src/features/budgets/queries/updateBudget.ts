import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const updateBudget = (
  budget: Budget,
  ctx: AppContext,
): AppResult<Budget, DatabaseError> => {
  return fromDB(
    ctx.db
      .update(budgets)
      .set({
        startAmount: budget.startAmount,
        currentAmount: budget.currentAmount,
        sa_iv: budget.sa_iv,
        sa_tag: budget.sa_tag,
        ca_iv: budget.ca_iv,
        ca_tag: budget.ca_tag,
        updatedAt: new Date(),
      })
      .where(eq(budgets.id, budget.id))
      .returning(),
  ).andThen(([updatedBudget]) =>
    updatedBudget
      ? success(updatedBudget)
      : failure(new DatabaseError("Failed to update budget")),
  );
};
