import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { useActiveBudget } from './useActiveBudget'

export function useCategoryBudgets({ userId }: { userId?: string }) {
  const { data: activeBudget } = useActiveBudget({ userId })
  
  return useQuery({
    queryKey: queryKeys.categoryBudgets(activeBudget?.id || 0),
    queryFn: async () => {
      const { getCategoryBudgetsRoute } = await import('../../server/routes/budgets/getCategoryBudgetsRoute')
      return getCategoryBudgetsRoute({ data: { budgetId: activeBudget!.id } })
    },
    enabled: !!activeBudget?.id,
  })
}