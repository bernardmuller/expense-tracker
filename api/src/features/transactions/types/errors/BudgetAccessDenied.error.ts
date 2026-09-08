import { createError } from "@/lib/utils/createError";

export const BudgetAccessDeniedError = createError(
  "BudgetAccessDeniedError",
  (budgetId: string) => `Access denied to budget ${budgetId}`,
  {
    code: "BUDGET_ACCESS_DENIED",
    error: "Forbidden",
    statusCode: 403,
  },
);
