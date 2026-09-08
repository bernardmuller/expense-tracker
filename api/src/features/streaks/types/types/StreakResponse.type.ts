import type { z } from "zod";
import type {
  streakDaySchema,
  streakResponseSchema,
} from "../schemas/streakResponse.schema";

export type StreakDay = z.infer<typeof streakDaySchema>;
export type StreakResponse = z.infer<typeof streakResponseSchema>;
