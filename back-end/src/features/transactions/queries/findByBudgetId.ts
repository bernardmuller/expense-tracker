import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { eq, desc } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import type { Transaction } from "../types";

export const findByBudgetId = (
  budgetId: string,
  limit: number,
  ctx: AppContext,
): ResultAsync<Transaction[], InstanceType<typeof EntityReadError>> =>
  ResultAsync.fromPromise(
    ctx.db
      .select()
      .from(expenses)
      .where(eq(expenses.budgetId, budgetId))
      .orderBy(desc(expenses.createdAt))
      .limit(limit),
    (error) => new EntityReadError("Transaction", String(error)),
  );
