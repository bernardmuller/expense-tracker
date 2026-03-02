import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getBudgetExpenses } from "../services";

export const getBudgetExpensesHandler = async (c: Context) => {
  const budgetId = c.req.param("id");
  const user = c.get("user");
  const ctx = createContext();
  const result = await getBudgetExpenses(
    budgetId,
    user.userId,
    ctx,
  );

  return result.match(
    (expenses) => c.json(expenses, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
