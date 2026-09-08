import z from "zod";
import { MAX_STREAK_DAYS } from "../../constants";

export const getStreakQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(MAX_STREAK_DAYS).optional(),
});
