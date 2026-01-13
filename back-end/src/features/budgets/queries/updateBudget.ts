import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import {
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";

export const updateBudget = (
  budget: Budget,
  ctx: AppContext,
): ResultAsync<Budget, InstanceType<typeof EntityUpdateError>> =>
  ResultAsync.fromPromise(
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
    (error) => new EntityUpdateError("Budget", error),
  ).andThen(([updatedBudget]) =>
    updatedBudget
      ? okAsync(updatedBudget)
      : errAsync(new EntityUpdateError("Budget")),
  );
