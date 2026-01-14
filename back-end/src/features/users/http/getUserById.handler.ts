import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getUserById } from "../operations";

export const getUserByIdHandler = async (c: Context) => {
  const id = c.req.param("id");
  const ctx = createContext();
  const result = await getUserById(id, ctx);

  return result.match(
    (users) => c.json(users, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
