import type { AppContext } from "@/lib/db/context";
import type { Budget } from "@/lib/db/schema";
import { AppResult } from "@/lib/result";
import { ResultAsync } from "neverthrow";
import type { SearchQueries } from "@/lib/http/types";
import * as BudgetRepo from "../queries/index";
import * as BudgetDomain from "../domain/budget-processing.domain";

export const getBudgets = (
  search: SearchQueries<
    Budget,
    {
      userId: string;
      isActive: boolean;
    }
  >,
  ctx: AppContext,
): AppResult<Array<Budget>> => {
  return BudgetRepo.findBudgets(search, ctx).andThen((budgets) => {
    const decryptPromises = budgets.map((budget) =>
      BudgetDomain.decryptBudgetAmounts(budget).map((decryptedAmounts) => ({
        ...budget,
        currentAmount: decryptedAmounts.currentAmount,
        startAmount: decryptedAmounts.startAmount,
      })),
    );

    return ResultAsync.combine(decryptPromises);
  });
};
