import {
  budgetBreakDownItemProps,
  overBudgetBreakDownItemProps,
  plannedBudgetBreakDownItemProps,
} from './budgetBreakDownItemProps.factory'
import type {
  BudgetBreakdownItemProps,
  OverBudgetBreakdownItemProps,
  PlannedBudgetBreakdownItemProps,
} from '../BudgetBreakdownItem.types'

export const generateBudgetBreakdownItemProps = (
  overwrites: Partial<BudgetBreakdownItemProps> = {},
) => ({
  ...budgetBreakDownItemProps,
  ...overwrites,
})

export const generateOverBudgetBreakdownItemProps = (
  overwrites: Partial<OverBudgetBreakdownItemProps> = {},
) => ({
  ...overBudgetBreakDownItemProps,
  ...overwrites,
})

export const generatePlannedBudgetBreakdownItemProps = (
  overwrites: Partial<PlannedBudgetBreakdownItemProps> = {},
) => ({
  ...plannedBudgetBreakDownItemProps,
  ...overwrites,
})
