import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { getActiveBudget } from '@/server/budgets'

export function useActiveBudget({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: queryKeys.activeBudget(userId!),
    queryFn: async () => {
      const { getActiveBudget } = await import('../../server/budgets')
      return await getActiveBudget({ data: { userId: userId! } })
    },
    enabled: !!userId,
  })
}

