import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getBudgetWithRelatives } from "../operations";

export const getBudgetWithRelativesHandler = async (c: Context) => {
  const budgetId = c.req.param("id");
  const user = c.get("user");
  const ctx = createContext();
  const result = await getBudgetWithRelatives(
    budgetId,
    user.userId,
    ctx,
  );

  return result.match(
    (data) => c.json(data, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
