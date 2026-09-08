import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createNotificationPreference } from "../services";

export const createNotificationPreferenceHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const body = await c.req.json();
  const ctx = createContext();
  const result = await createNotificationPreference(user.userId, body, ctx);

  return result.match(
    (notificationPreference) => c.json({ notificationPreference }, 201),
    (error) => mapErrorToResponse(error, c),
  );
};
