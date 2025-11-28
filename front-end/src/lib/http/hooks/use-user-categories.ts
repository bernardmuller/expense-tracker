import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { withAccessToken } from '../with-token'

type UserCategoriesSuccess =
  paths['/users/{id}/categories']['get']['responses']['200']['content']['application/json']

type UserCategoriesError = {
  error: string
  message: string
  code: string
}

export function useUserCategories(): UseQueryResult<UserCategoriesSuccess, Error> {
  const userIdResult = getUserIdFromAccessToken()

  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
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
    },
    enabled: userIdResult.isOk(),
  })
}
