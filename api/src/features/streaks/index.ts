import { createRouter } from "@/lib/http/createApi";
import { getStreakRoute } from "./http/getStreak.route";
import { getStreakHandler } from "./http/getStreak.handler";
import { checkInRoute } from "./http/checkIn.route";
import { checkInHandler } from "./http/checkIn.handler";

export const streakRouter = createRouter()
  .openapi(getStreakRoute, getStreakHandler)
  .openapi(checkInRoute, checkInHandler);
