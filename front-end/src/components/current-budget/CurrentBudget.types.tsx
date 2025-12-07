export type CurrentBudgetBaseProps = {
  budgetName: string
  currentAmount: string
  startingAmount: string
  spentAmount: string
  spentPercentage: number
}

export type CurrentBudgetProps = CurrentBudgetBaseProps & {
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}
