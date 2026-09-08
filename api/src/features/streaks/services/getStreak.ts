import type { AppContext } from "@/lib/db/context";
import { getActivityByUserId } from "../queries";
import { computeStreak } from "../actions";
import { todayString, addDays } from "../dateUtils";
import type { StreakResponse } from "../types";
import { AppResult } from "@/lib/result";

/**
 * Reads the user's activity within the last `days` calendar days and computes
 * their streak. `today` is the server-local calendar day.
 */
export const getStreak = (
  userId: string,
  days: number,
  ctx: AppContext,
): AppResult<StreakResponse> => {
  const today = todayString();
  const fromDate = addDays(today, -(days - 1));

  return getActivityByUserId(userId, fromDate, ctx).andThen((activity) =>
    computeStreak(
      activity.map((a) => ({ date: a.date, count: a.count })),
      today,
    ),
  );
};
