import type { BudgetBreakdownItemProps } from "../types";
import { budgetBreakDownItemProps } from "./budgetBreakDownItemProps.factory";

export const generateBudgetBreakdownItemProps = (
  overwrites: Partial<BudgetBreakdownItemProps> = {}
) => ({
  ...budgetBreakDownItemProps,
  ...overwrites,
});
