import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getInstancesByBudgetId } from "../services";

export const listBudgetInstancesHandler = async (c: Context) => {
  const authedUser = c.get("user") as { userId: string };
  const budgetId = c.req.param("budgetId");
  const ctx = createContext();

  const result = await getInstancesByBudgetId(authedUser.userId, budgetId, ctx);

  return result.match(
    (recurringExpenses) => c.json({ recurringExpenses }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
