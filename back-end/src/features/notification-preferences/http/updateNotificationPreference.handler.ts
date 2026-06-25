import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { updateNotificationPreference } from "../services";

export const updateNotificationPreferenceHandler = async (c: Context) => {
  const id = c.req.param("id");
  const user = c.get("user") as { userId: string };
  const body = await c.req.json();
  const ctx = createContext();
  const result = await updateNotificationPreference(id, user.userId, body, ctx);

  return result.match(
    (notificationPreference) => c.json({ notificationPreference }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
