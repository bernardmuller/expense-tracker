import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createUser } from "../operations/createUser";

export const createUserHandler = async (c: Context) => {
  const body = await c.req.json();
  const ctx = createContext();
  const result = await createUser(body, ctx);

  return result.match(
    (user) => c.json(user, 201),
    (error) => mapErrorToResponse(error, c),
  );
};
