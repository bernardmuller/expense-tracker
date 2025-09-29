import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { getActiveBudgetRoute } from '../../server/routes/budgets/getActiveBudgetRoute'

export function useBudgetDetails({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: queryKeys.budgetDetailsByUserId(userId!),
    queryFn: async () => {
      return await getActiveBudgetRoute({ data: { userId: userId! } })
    },
    enabled: !!userId,
  })
}

