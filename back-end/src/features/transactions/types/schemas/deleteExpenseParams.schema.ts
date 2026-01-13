import z from "zod";

export const deleteExpenseParamsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  budgetId: z.string().uuid("Invalid budget ID"),
  expenseId: z.string().uuid("Invalid expense ID"),
});
