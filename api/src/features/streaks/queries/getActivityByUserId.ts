import type { AppContext } from "@/lib/db/context";
import { userActivity, type UserActivity } from "@/lib/db/schema";
import { and, eq, gte, asc } from "drizzle-orm";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

/**
 * Returns the user's activity rows on/after `fromDate` (YYYY-MM-DD), ordered by
 * date ascending.
 */
export const getActivityByUserId = (
  userId: string,
  fromDate: string,
  ctx: AppContext,
): AppResult<UserActivity[], DatabaseError> =>
  fromDB(
    ctx.db
      .select()
      .from(userActivity)
      .where(
        and(eq(userActivity.userId, userId), gte(userActivity.date, fromDate)),
      )
      .orderBy(asc(userActivity.date)),
  );
