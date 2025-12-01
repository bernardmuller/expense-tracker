import { toast } from 'sonner'
import { withAccessToken } from '../with-token'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'

type ActiveBudgetSuccess =
  paths['/users/{id}/budgets/active']['get']['responses']['200']['content']['application/json']

type ActiveBudgetError =
  paths['/users/{id}/budgets/active']['get']['responses']['404']['content']['application/json']

/**
 * Query function for fetching the active budget
 * Can be used in both hooks and route loaders
 */
export async function fetchActiveBudget(): Promise<ActiveBudgetSuccess> {
  const userIdResult = getUserIdFromAccessToken()

  if (userIdResult.isErr()) {
    toast.error('Unable to get user information')
    throw new Error('Unable to get user information')
  }

  const userId = userIdResult.value

  const result = await withAccessToken(
    (ctx) => {
      return toResult(
        client.GET('/users/{id}/budgets/active', {
          params: {
            path: { id: userId },
          },
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      )
    },
    (): ActiveBudgetError => ({
      error: 'Unauthorized',
      message: 'No access token found',
      code: 'MISSING_ACCESS_TOKEN',
    }),
  )()

  return result.match(
    (data) => data,
    (error) => {
      toast.error(error.message || 'Failed to get active budget')
      throw error
    },
  )
}

/**
 * Get query options for active budget
 * Used in loaders to prefetch data
 */
export function getActiveBudgetQueryOptions() {
  const userIdResult = getUserIdFromAccessToken()

  return {
    queryKey: userIdResult.isOk()
      ? queryKeys.budgets.active(userIdResult.value)
      : ['budgets', 'active', 'unknown'],
    queryFn: fetchActiveBudget,
  }
}
