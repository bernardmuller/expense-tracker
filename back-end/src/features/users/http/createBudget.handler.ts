import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createNewBudget } from "../operations";

export const createBudgetHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const body = await c.req.json();
  const ctx = createContext();
  const result = await createNewBudget(user.userId, body, ctx);

  return result.match(
    (budget) => c.json(budget, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
