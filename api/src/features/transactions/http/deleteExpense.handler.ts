import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { deleteTransactionAndUpdateBudget } from "../services";

export const deleteExpenseHandler = async (c: Context) => {
  const userId = c.req.param("userId");
  const budgetId = c.req.param("budgetId");
  const expenseId = c.req.param("expenseId");

  if (!userId || !budgetId || !expenseId) {
    return c.json({ error: "Missing required parameters" }, 400);
  }

  const ctx = createContext();
  const result = await deleteTransactionAndUpdateBudget(
    userId,
    budgetId,
    expenseId,
    ctx,
  );

  return result.match(
    (expense) => c.json(expense, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
