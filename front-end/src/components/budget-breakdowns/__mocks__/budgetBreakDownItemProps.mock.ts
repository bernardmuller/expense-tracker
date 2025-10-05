import type { DefaultBudgetBreakdownItemProps, PlannedBudgetBreakdownItemProps } from "../types";
import { budgetBreakDownItemProps, plannedBudgetBreakDownItemProps } from "./budgetBreakDownItemProps.factory";

export const generateDefaultBudgetBreakdownItemProps = (
  overwrites: Partial<DefaultBudgetBreakdownItemProps> = {}
) => ({
  ...budgetBreakDownItemProps,
  ...overwrites,
});

export const generatePlannedBudgetBreakdownItemProps = (
  overwrites: Partial<PlannedBudgetBreakdownItemProps> = {}
) => ({
  ...plannedBudgetBreakDownItemProps,
  ...overwrites,
});
