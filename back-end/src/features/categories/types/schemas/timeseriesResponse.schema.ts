import { z } from "zod";

export const timeseriesDataPointSchema = z.object({
  period: z
    .string()
    .optional()
    .describe(
      "ISO date representing the start of the month (only present when granularity is 'month')",
    ),
  expenseCount: z.number().int().describe("Number of expenses"),
  totalAmount: z.number().describe("Total expense amount"),
  budgetId: z
    .string()
    .uuid()
    .optional()
    .describe("Budget ID (only present when granularity is 'budget')"),
  budgetName: z
    .string()
    .optional()
    .describe("Budget name (only present when granularity is 'budget')"),
  budgetAmount: z
    .number()
    .optional()
    .describe(
      "Allocated budget amount for this category (only present when granularity is 'budget')",
    ),
});

export const timeseriesResponseSchema = z.object({
  categoryId: z.string().uuid(),
  granularity: z.enum(["month", "budget"]),
  timeseries: z.array(timeseriesDataPointSchema),
});
