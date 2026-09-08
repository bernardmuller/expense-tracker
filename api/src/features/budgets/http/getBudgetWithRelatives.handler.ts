import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getBudgetWithRelativesById } from "../services/getBudgetWithRelativesById";

export const getBudgetWithRelativesHandler = async (c: Context) => {
  const budgetId = c.req.param("id");
  const user = c.get("user");
  const ctx = createContext();
  const result = await getBudgetWithRelativesById(budgetId, user.userId, ctx);

  return result.match(
    (data) => c.json(data, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
