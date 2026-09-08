import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getAllUsers } from "../services/getAllUsers";

export const getAllUsersHandler = async (c: Context) => {
  const ctx = createContext();
  const result = await getAllUsers(ctx);

  return result.match(
    (users) => c.json(users, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
