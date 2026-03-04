import { z } from "zod";

export const timeseriesDataPointSchema = z.object({
  period: z.string().describe("ISO date representing the start of the month"),
  expenseCount: z.number().int().describe("Number of expenses in this period"),
  totalAmount: z.number().describe("Total expense amount for this period"),
});

export const timeseriesResponseSchema = z.object({
  categoryId: z.string().uuid(),
  granularity: z.literal("month"),
  timeseries: z.array(timeseriesDataPointSchema),
});
