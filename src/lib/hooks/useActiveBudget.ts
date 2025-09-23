import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useActiveBudget({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: queryKeys.activeBudget(userId!),
    queryFn: async () => {
      const { getActiveBudgetRoute } = await import('../../server/routes/budgets/getActiveBudgetRoute')
      return getActiveBudgetRoute({ data: { userId: userId! } })
    },
    enabled: !!userId,
  })
}
