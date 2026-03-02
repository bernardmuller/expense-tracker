import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { onboardUser } from "../services";

export const onboardUserHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const body = await c.req.json();
  const ctx = createContext();
  const result = await onboardUser(user.userId, body, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
