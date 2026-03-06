import { z } from "zod";

export const categoryExpensesPathParamsSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID format"),
});

export const categoryExpensesQueryParamsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(1000).optional().default(100),
  offset: z.coerce.number().int().min(0).optional().default(0),
  sort: z.enum(["createdAt", "-createdAt"]).optional().default("-createdAt"),
});
