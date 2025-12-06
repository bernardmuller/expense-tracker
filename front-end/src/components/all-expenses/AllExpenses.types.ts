export interface AllExpensesProps {
  budgetName: string
  children: React.ReactNode
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}
