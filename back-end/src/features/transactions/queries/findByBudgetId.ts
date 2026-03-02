import type { AppContext } from "@/lib/db/context";
import { expenses } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Transaction } from "../types";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findByBudgetId = (
  budgetId: string,
  limit: number,
  ctx: AppContext,
): AppResult<Transaction[], DatabaseError> =>
  fromDB(
    ctx.db
      .select()
      .from(expenses)
      .where(eq(expenses.budgetId, budgetId))
      .orderBy(desc(expenses.createdAt))
      .limit(limit),
  );
