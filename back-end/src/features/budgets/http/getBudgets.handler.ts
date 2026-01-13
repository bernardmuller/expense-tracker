import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";
import { getBudgets } from "../operations";
import type { Budget } from "../types";

export const getBudgetsHandler = async (c: Context) => {
  return parseSearchQuery<
    Budget,
    {
      isActive: boolean;
      userId: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["name", "isActive", "createdAt"],
    filterKeys: ["isActive", "userId"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return getBudgets(search, ctx);
    })
    .match(
      (budgets) => c.json({ budgets, count: budgets.length }, 200),
      (error) => mapErrorToResponse(error, c),
    );
};
