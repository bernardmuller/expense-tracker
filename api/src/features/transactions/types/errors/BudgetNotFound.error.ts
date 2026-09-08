import { createError } from "@/lib/utils/createError";

export const BudgetNotFoundError = createError(
  "BudgetNotFoundError",
  (budgetId: string) => `Budget ${budgetId} not found`,
  {
    code: "BUDGET_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);
