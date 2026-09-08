import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";
import { getTransactions } from "../services";
import type { Transaction } from "../types";

export const getTransactionsHandler = async (c: Context) => {
  return parseSearchQuery<
    Transaction,
    {
      budgetId: string;
      categoryId: string;
      userId: string;
      description: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["createdAt"],
    filterKeys: ["budgetId", "categoryId", "userId", "description"],
    allowedIncludes: ["category"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return getTransactions(search, ctx);
    })
    .match(
      (transactions) =>
        c.json({ transactions, count: transactions.length }, 200),
      (error) => mapErrorToResponse(error, c),
    );
};
