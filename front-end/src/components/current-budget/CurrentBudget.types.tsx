export type CurrentBudgetProps = {
  budgetName: string
  currentAmount: string
  startingAmount: string
  spentAmount: string
  spentPercentage: number
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}
