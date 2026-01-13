import { createRouter } from "@/lib/http/createApi";
import { getBudgetsRoute } from "./getBudgets.route";
import { getBudgetsHandler } from "./getBudgets.handler";
import { getActiveBudgetRoute } from "./getActiveBudget.route";
import { getActiveBudgetHandler } from "./getActiveBudget.handler";
import { getBudgetExpensesRoute } from "./getBudgetExpenses.route";
import { getBudgetExpensesHandler } from "./getBudgetExpenses.handler";

export const budgetRouter = createRouter()
  .openapi(getBudgetExpensesRoute, getBudgetExpensesHandler)
  .openapi(getBudgetsRoute, getBudgetsHandler)
  .openapi(getActiveBudgetRoute, getActiveBudgetHandler);

// Barrel exports
export * from "./getBudgets.route";
export * from "./getBudgets.handler";
export * from "./getActiveBudget.route";
export * from "./getActiveBudget.handler";
export * from "./getBudgetExpenses.route";
export * from "./getBudgetExpenses.handler";
