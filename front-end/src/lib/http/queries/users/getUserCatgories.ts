import { toast } from 'sonner'
import { client, toResult } from '../../client'
import { queryKeys } from '../../query-keys'
import { withAccessToken } from '../../with-token'
import type { paths } from '../../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'

type UserCategoriesSuccess =
  paths['/users/{id}/categories']['get']['responses']['200']['content']['application/json']

type UserCategoriesError = {
  error: string
  message: string
  code: string
}

export async function fetchUserCategories(): Promise<UserCategoriesSuccess> {
  const userIdResult = getUserIdFromAccessToken()

  if (userIdResult.isErr()) {
    toast.error('Unable to get user information')
    throw new Error('Unable to get user information')
  }

  const userId = userIdResult.value

  const result = await withAccessToken(
    (ctx) => {
      return toResult(
        client.GET('/users/{id}/categories', {
          params: {
            path: { id: userId },
          },
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      )
    },
    (): UserCategoriesError => ({
      error: 'Unauthorized',
      message: 'No access token found',
      code: 'MISSING_ACCESS_TOKEN',
    }),
  )()

  return result.match(
    (data) => data,
    (error) => {
      toast.error(error.message || 'Failed to get user categories')
      throw error
    },
  )
}

export function getUserCategoriesQueryOptions() {
  return {
    queryKey: queryKeys.users.categories,
    queryFn: fetchUserCategories,
    staleTime: 60 * 60 * 1000,
  }
}
