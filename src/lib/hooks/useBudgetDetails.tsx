import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useBudgetDetails({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: queryKeys.activeBudget(userId!),
    queryFn: async () => {
      const { getActiveBudgetRoute } = await import('../../server/routes/budgets/getActiveBudgetRoute')
      return await getActiveBudgetRoute({ data: { userId: userId! } })
    },
    enabled: !!userId,
  })
}

