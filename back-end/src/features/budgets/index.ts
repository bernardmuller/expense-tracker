import { createRouter } from "@/lib/http/createApi";
import { getBudgetsRoute } from "./http/getBudgets.route";
import { getBudgetsHandler } from "./http/getBudgets.handler";
import { getActiveBudgetRoute } from "./http/getActiveBudget.route";
import { getActiveBudgetHandler } from "./http/getActiveBudget.handler";
import { getBudgetExpensesRoute } from "./http/getBudgetExpenses.route";
import { getBudgetExpensesHandler } from "./http/getBudgetExpenses.handler";
import { getBudgetWithRelativesRoute } from "./http/getBudgetWithRelatives.route";
import { getBudgetWithRelativesHandler } from "./http/getBudgetWithRelatives.handler";

export const budgetRouter = createRouter()
  .openapi(getBudgetExpensesRoute, getBudgetExpensesHandler)
  .openapi(getBudgetsRoute, getBudgetsHandler)
  .openapi(getActiveBudgetRoute, getActiveBudgetHandler)
  .openapi(getBudgetWithRelativesRoute, getBudgetWithRelativesHandler);
