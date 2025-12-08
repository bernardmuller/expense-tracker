export type CurrentBudgetBaseProps = {
  budgetName: string
  currentAmount: string
  startingAmount: string
  spentAmount: string
  spentPercentage: number
  onClick?: () => void
}

export type CurrentBudgetProps = CurrentBudgetBaseProps & {
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}
