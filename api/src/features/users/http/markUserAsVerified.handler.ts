import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { markUserAsVerified } from "../services";

export const markUserAsVerifiedHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const ctx = createContext();
  const result = await markUserAsVerified(userId, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
