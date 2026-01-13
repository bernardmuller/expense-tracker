import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";
import { getCategories } from "../operations";
import type { Category } from "../types";

export const getCategoriesHandler = async (c: Context) => {
  return parseSearchQuery<
    Category,
    {
      userId: string;
      key: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["key", "createdAt"],
    filterKeys: ["userId", "key"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return getCategories(search, ctx);
    })
    .match(
      (categories) => c.json({ categories, count: categories.length }, 200),
      (error) => mapErrorToResponse(error, c),
    );
};
