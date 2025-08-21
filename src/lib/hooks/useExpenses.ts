import { useQuery } from '@tanstack/react-query'
import { getRecentExpenses, getAllExpenses } from '../../server/expenses'
import { queryKeys } from '../query-client'

export function useRecentExpenses({ budgetId }: { budgetId?: string }) {
  return useQuery({
    queryKey: queryKeys.recentExpenses(budgetId!),
    queryFn: () => getRecentExpenses({ data: { budgetId: budgetId! } }),
    enabled: !!budgetId,
  })
}

export function useAllExpenses({ budgetId }: { budgetId?: string }) {
  return useQuery({
    queryKey: queryKeys.allExpenses(budgetId!),
    queryFn: () => getAllExpenses({ data: { budgetId: budgetId! } }),
    enabled: !!budgetId,
  })
}