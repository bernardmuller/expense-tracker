import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { checkIn } from "../services";

export const checkInHandler = async (c: Context) => {
  const user = c.get("user");
  const ctx = createContext();
  const result = await checkIn(user.userId, ctx);

  return result.match(
    (data) => c.json(data, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
