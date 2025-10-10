export type BudgetBreakdownItemProps = {
  name: string
  icon: string
  spentAmount: string
}

export type OverBudgetBreakdownItemProps = BudgetBreakdownItemProps & {
  plannedAmount: string
}

export type PlannedBudgetBreakdownItemProps = BudgetBreakdownItemProps & {
  percentage: number
  plannedAmount: string
}
