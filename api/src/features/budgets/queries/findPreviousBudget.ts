import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { eq, desc, and, lt } from "drizzle-orm";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findPreviousBudget = (
  userId: string,
  before: Date,
  ctx: AppContext,
): AppResult<Budget | null, DatabaseError> => {
  return fromDB(
    ctx.db.query.budgets.findFirst({
      where: and(eq(budgets.userId, userId), lt(budgets.createdAt, before)),
      orderBy: desc(budgets.createdAt),
    }),
  ).map((budget) => budget ?? null);
};
