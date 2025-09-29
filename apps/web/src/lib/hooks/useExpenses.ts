import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useRecentExpenses({ budgetId }: { budgetId?: number }) {
  return useQuery({
    queryKey: queryKeys.recentExpenses(budgetId!),
    queryFn: async () => {
      const { getRecentExpensesRoute } = await import('../../server/routes/expenses/getRecentExpensesRoute')
      return getRecentExpensesRoute({ data: { budgetId: budgetId! } })
    },
    enabled: !!budgetId,
  })
}

export function useAllExpenses({ budgetId }: { budgetId?: number }) {
  return useQuery({
    queryKey: queryKeys.allExpenses(budgetId!),
    queryFn: async () => {
      const { getAllExpensesRoute } = await import('../../server/routes/expenses/getAllExpensesRoute')
      return getAllExpensesRoute({ data: { budgetId: budgetId! } })
    },
    enabled: !!budgetId,
  })
}
