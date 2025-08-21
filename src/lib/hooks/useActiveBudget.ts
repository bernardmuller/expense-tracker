import { useQuery } from '@tanstack/react-query'
import { getActiveBudget } from '../../server/budgets'
import { queryKeys } from '../query-client'

export function useActiveBudget({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: queryKeys.activeBudget(userId!),
    queryFn: () => getActiveBudget({ data: { userId: userId! } }),
    enabled: !!userId,
  })
}