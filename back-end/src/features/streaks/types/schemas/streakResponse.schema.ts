import z from "zod";

export const streakDaySchema = z.object({
  date: z.string(),
  count: z.number(),
});

export const streakResponseSchema = z.object({
  days: z.array(streakDaySchema),
  currentStreak: z.number(),
  longestStreak: z.number(),
  totalActiveDays: z.number(),
  checkedInToday: z.boolean(),
});
