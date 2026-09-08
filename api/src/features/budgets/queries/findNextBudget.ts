import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { eq, and, gt, asc } from "drizzle-orm";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findNextBudget = (
  userId: string,
  after: Date,
  ctx: AppContext,
): AppResult<Budget | null, DatabaseError> => {
  return fromDB(
    ctx.db.query.budgets.findFirst({
      where: and(eq(budgets.userId, userId), gt(budgets.createdAt, after)),
      orderBy: asc(budgets.createdAt),
    }),
  ).map((budget) => budget ?? null);
};
