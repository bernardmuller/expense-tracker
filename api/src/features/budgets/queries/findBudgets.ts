import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";

export const findBudgets = (
  search: SearchQueries<
    Budget,
    {
      isActive: boolean;
      userId: string;
    }
  >,
  ctx: AppContext,
): AppResult<Array<Budget>, DatabaseError> => {
  return fromDB(
    buildDrizzleQuery(
      ctx.db.select().from(budgets),
      search,
      {
        userId: (value) => eq(budgets.userId, value),
        isActive: (value) => eq(budgets.isActive, value),
      },
      {
        name: budgets.name,
        isActive: budgets.isActive,
        createdAt: budgets.createdAt,
      },
    ),
  );
};
