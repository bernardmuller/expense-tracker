import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { updateUserPreferences } from "../services";

export const updateUserPreferencesHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const body = await c.req.json();
  const ctx = createContext();
  const result = await updateUserPreferences(userId, body, ctx);

  return result.match(
    (prefs) => {
      console.log(prefs);
      return c.json(prefs, 200);
    },
    (error) => mapErrorToResponse(error, c),
  );
};
