import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getUserPreferences } from "../services";

export const getUserPreferencesHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const ctx = createContext();
  const result = await getUserPreferences(userId, ctx);

  return result.match(
    (prefs) => c.json(prefs, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
