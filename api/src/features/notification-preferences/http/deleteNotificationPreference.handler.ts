import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { deleteNotificationPreference } from "../services";

export const deleteNotificationPreferenceHandler = async (c: Context) => {
  const id = c.req.param("id");
  const user = c.get("user") as { userId: string };
  const ctx = createContext();
  const result = await deleteNotificationPreference(id, user.userId, ctx);

  return result.match(
    (notificationPreference) => c.json({ notificationPreference }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
