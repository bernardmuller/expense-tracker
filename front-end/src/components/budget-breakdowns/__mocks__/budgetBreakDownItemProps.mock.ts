import {
  budgetBreakDownItemProps,
  plannedBudgetBreakDownItemProps,
  overBudgetBreakDownItemProps,
} from './budgetBreakDownItemProps.factory'
import type {
  BudgetBreakdownItemProps,
  OverBudgetBreakdownItemProps,
  PlannedBudgetBreakdownItemProps,
} from '../types'

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
