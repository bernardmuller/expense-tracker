import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getCategoryExpenses } from "../services";

export const getCategoryExpensesHandler = async (c: Context) => {
  const categoryId = c.req.param("categoryId");
  const limitQuery = c.req.query("limit");
  const offsetQuery = c.req.query("offset");
  const sortQuery = c.req.query("sort");
  const user = c.get("user");
  const ctx = createContext();

  const options = {
    limit: limitQuery ? parseInt(limitQuery, 10) : 100,
    offset: offsetQuery ? parseInt(offsetQuery, 10) : 0,
    sort: (sortQuery === "createdAt" || sortQuery === "-createdAt"
      ? sortQuery
      : "-createdAt") as "createdAt" | "-createdAt",
  };

  const result = await getCategoryExpenses(
    user.userId,
    categoryId,
    options,
    ctx,
  );

  return result.match(
    (data) => c.json(data, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
