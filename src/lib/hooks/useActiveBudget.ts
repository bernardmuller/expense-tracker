import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useActiveBudget({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: queryKeys.activeBudget(userId!),
    queryFn: async () => {
      const { getActiveBudgetOnlyRoute } = await import('../../server/routes/budgets/getActiveBudgetOnlyRoute')
      return await getActiveBudgetOnlyRoute({ data: { userId: userId! } })
    },
    enabled: !!userId,
  })
}

