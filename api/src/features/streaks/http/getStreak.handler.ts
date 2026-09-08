import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getStreak } from "../services";
import { DEFAULT_STREAK_DAYS } from "../constants";

export const getStreakHandler = async (c: Context) => {
  const user = c.get("user");
  const days = Number(c.req.query("days")) || DEFAULT_STREAK_DAYS;
  const ctx = createContext();
  const result = await getStreak(user.userId, days, ctx);

  return result.match(
    (data) => c.json(data, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
