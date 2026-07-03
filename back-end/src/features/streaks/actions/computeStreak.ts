import { ok, type Result } from "neverthrow";
import { previousDay, diffInDays } from "../dateUtils";
import type { StreakDay, StreakResponse } from "../types";

type ActivityInput = { date: string; count: number };

/**
 * Pure streak computation. Turns a set of daily activity rows into the
 * current/longest streak, total active days and the per-day series used by the
 * contribution graph. `today` (YYYY-MM-DD, server-local) is injected so this
 * function stays pure and deterministic.
 *
 * A day "counts" toward the streak if it has any activity. The intensity value
 * returned per day is the number of app opens that day — swap the reduction in
 * the `counts` map to a constant `1` to make the graph binary instead.
 */
export const computeStreak = (
  activity: ActivityInput[],
  today: string,
): Result<StreakResponse, never> => {
  const counts = new Map<string, number>();
  for (const a of activity) {
    counts.set(a.date, (counts.get(a.date) ?? 0) + a.count);
  }

  const days: StreakDay[] = Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const checkedInToday = counts.has(today);

  // Current streak: walk backwards from today. If the user hasn't opened the
  // app yet today the streak is still "alive" through yesterday, so start there.
  let currentStreak = 0;
  let cursor = checkedInToday ? today : previousDay(today);
  while (counts.has(cursor)) {
    currentStreak++;
    cursor = previousDay(cursor);
  }

  // Longest streak: scan the sorted active days for the longest run of
  // consecutive calendar days.
  let longestStreak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const { date } of days) {
    if (prev && diffInDays(date, prev) === 1) {
      run++;
    } else {
      run = 1;
    }
    if (run > longestStreak) longestStreak = run;
    prev = date;
  }

  return ok({
    days,
    currentStreak,
    longestStreak,
    totalActiveDays: counts.size,
    checkedInToday,
  });
};
