export type DefaultBudgetBreakdownItemProps = {
  name: string
  icon: string
  percentage: number
  spentAmount: string,
}

export type PlannedBudgetBreakdownItemProps = DefaultBudgetBreakdownItemProps & {
  plannedAmount: string
}
