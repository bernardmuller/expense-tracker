import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { updateUser } from "../operations";

export const updateUserHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const body = await c.req.json();
  const ctx = createContext();
  const result = await updateUser(userId, body, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
