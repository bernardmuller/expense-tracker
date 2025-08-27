import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useRecentExpenses({ budgetId }: { budgetId?: number }) {
  return useQuery({
    queryKey: queryKeys.recentExpenses(budgetId!),
    queryFn: async () => {
      const { getRecentExpenses } = await import('../../server/expenses')
      return getRecentExpenses({ data: { budgetId: budgetId! } })
    },
    enabled: !!budgetId,
  })
}

export function useAllExpenses({ budgetId }: { budgetId?: number }) {
  return useQuery({
    queryKey: queryKeys.allExpenses(budgetId!),
    queryFn: async () => {
      const { getAllExpenses } = await import('../../server/expenses')
      return getAllExpenses({ data: { budgetId: budgetId! } })
    },
    enabled: !!budgetId,
  })
}