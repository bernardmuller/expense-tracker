import { z } from "zod";

export const timeseriesPathParamsSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID format"),
});

export const timeseriesQueryParamsSchema = z.object({
  months: z.coerce
    .number()
    .int("Months must be an integer")
    .min(1, "Months must be at least 1")
    .max(24, "Months must be at most 24")
    .default(6),
  granularity: z
    .enum(["month", "budget"])
    .default("month")
    .describe(
      "Aggregation level: 'month' groups across all budgets by month, 'budget' groups by individual budgets",
    ),
});
