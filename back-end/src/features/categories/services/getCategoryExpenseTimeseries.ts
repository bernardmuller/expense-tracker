import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { TimeseriesResponse } from "../types";
import * as CategoryRepo from "../repositories";

export const getCategoryExpenseTimeseries = (
  userId: string,
  categoryId: string,
  months: number,
  ctx: AppContext,
): AppResult<TimeseriesResponse> => {
  return CategoryRepo.verifyCategoryOwnership(userId, categoryId, ctx).andThen(
    () =>
      CategoryRepo.getCategoryExpenseTimeseries(
        userId,
        categoryId,
        months,
        ctx,
      ).map((timeseries) => ({
        categoryId,
        granularity: "month" as const,
        timeseries,
      })),
  );
};
