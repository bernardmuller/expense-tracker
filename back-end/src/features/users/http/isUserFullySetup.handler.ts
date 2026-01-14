import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { isUserFullySetup } from "../operations";

export const isUserFullySetupHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const ctx = createContext();
  const result = await isUserFullySetup(userId, ctx);

  return result.match(
    (isSetup) => c.json({ isFullySetup: isSetup }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
