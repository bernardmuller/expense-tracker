import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getCategoryExpenseTimeseries } from "../services";

export const getCategoryExpenseTimeseriesHandler = async (c: Context) => {
  const categoryId = c.req.param("categoryId");
  const monthsQuery = c.req.query("months");
  const user = c.get("user");
  const ctx = createContext();

  const monthsParam = monthsQuery ? parseInt(monthsQuery, 10) : 6;

  const result = await getCategoryExpenseTimeseries(
    user.userId,
    categoryId,
    monthsParam,
    ctx,
  );

  return result.match(
    (data) => c.json(data, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
