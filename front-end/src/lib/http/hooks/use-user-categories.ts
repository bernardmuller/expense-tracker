import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import { getUserCategoriesQueryOptions } from '../queries/users'
import type { paths } from '../schema'

type UserCategoriesSuccess =
  paths['/users/{id}/categories']['get']['responses']['200']['content']['application/json']

export function useUserCategories(): UseQueryResult<
  UserCategoriesSuccess,
  Error
> {
  const userIdResult = getUserIdFromAccessToken()

  return useQuery({
    ...getUserCategoriesQueryOptions(),
    enabled: userIdResult.isOk(),
  })
}
