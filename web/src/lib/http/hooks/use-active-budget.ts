import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import type { paths } from '../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { getActiveBudgetQueryOptions } from '../queries/budget'

type ActiveBudgetSuccess =
  paths['/users/{id}/budgets/active']['get']['responses']['200']['content']['application/json']

export function useActiveBudget(): UseQueryResult<ActiveBudgetSuccess, Error> {
  const userIdResult = getUserIdFromAccessToken()

  return useQuery({
    ...getActiveBudgetQueryOptions(),
    enabled: userIdResult.isOk(),
  })
}
