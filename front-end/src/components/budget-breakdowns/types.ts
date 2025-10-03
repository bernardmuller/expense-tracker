export type BudgetBreakdownItemProps = {
  name: string
  icon: string
  spent: number
  planned?: number
  percentage: number
  onClick: () => void
  isUnplanned: boolean
  isOverBudget: boolean
}
