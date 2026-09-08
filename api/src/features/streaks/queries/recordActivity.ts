import type { AppContext } from "@/lib/db/context";
import { userActivity, type UserActivity } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { generateUuid } from "@/lib/utils/generateUuid";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

/**
 * Records one app-open for the user on the given day. Idempotent per day: the
 * first open inserts the row, subsequent opens increment its count.
 */
export const recordActivity = (
  userId: string,
  date: string,
  ctx: AppContext,
): AppResult<UserActivity, DatabaseError> =>
  fromDB(
    ctx.db
      .insert(userActivity)
      .values({ id: generateUuid(), userId, date, count: 1 })
      .onConflictDoUpdate({
        target: [userActivity.userId, userActivity.date],
        set: {
          count: sql`${userActivity.count} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning(),
  ).andThen(([row]) =>
    row ? success(row) : failure(new DatabaseError("Failed to record activity")),
  );
