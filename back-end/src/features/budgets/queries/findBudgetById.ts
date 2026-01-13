import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";

export const findBudgetById = (
  budgetId: string,
  ctx: AppContext,
): ResultAsync<
  Budget,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(budgets).where(eq(budgets.id, budgetId)),
    (error) => new EntityReadError("Budget", String(error)),
  ).andThen(([budget]) =>
    budget
      ? okAsync(budget)
      : errAsync(new EntityNotFoundError(`Budget: ${budgetId}`)),
  );
