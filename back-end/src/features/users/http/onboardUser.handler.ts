import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { onboardUser } from "../operations";

export const onboardUserHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const body = c.req.valid("json");
  const ctx = createContext();
  const result = await onboardUser(user.userId, body, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
