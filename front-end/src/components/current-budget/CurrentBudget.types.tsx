
export type CurrentBudgetProps = {
  budgetName: string
  currentAmount: string
  startingAmount: string
  spentAmount: string
  spentPercentage: number
  onClick: () => void
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}
