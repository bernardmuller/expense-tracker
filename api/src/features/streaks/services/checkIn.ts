import type { AppContext } from "@/lib/db/context";
import { recordActivity } from "../queries";
import { getStreak } from "./getStreak";
import { todayString } from "../dateUtils";
import { DEFAULT_STREAK_DAYS } from "../constants";
import type { StreakResponse } from "../types";
import { AppResult } from "@/lib/result";

/**
 * Records today's app-open for the user and returns their updated streak.
 */
export const checkIn = (
  userId: string,
  ctx: AppContext,
): AppResult<StreakResponse> => {
  const today = todayString();

  return recordActivity(userId, today, ctx).andThen(() =>
    getStreak(userId, DEFAULT_STREAK_DAYS, ctx),
  );
};
