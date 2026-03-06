import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { TimeseriesResponse } from "../types";
import * as CategoryRepo from "../repositories";

export const getCategoryExpenseTimeseries = (
  userId: string,
  categoryId: string,
  months: number,
  granularity: "month" | "budget",
  ctx: AppContext,
): AppResult<TimeseriesResponse> => {
  return CategoryRepo.getCategoryExpenseTimeseries(
    userId,
    categoryId,
    months,
    granularity,
    ctx,
  ).map((timeseries) => ({
    categoryId,
    granularity,
    timeseries,
  }));
};
