import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'
import { withAccessToken } from '../with-token'

type CategoriesSuccess =
  paths['/categories']['get']['responses']['200']['content']['application/json']

type CategoriesError = {
  error: string
  message: string
  code: string
}

export async function fetchCategories(): Promise<CategoriesSuccess> {
  const result = await withAccessToken(
    (ctx) => {
      return toResult(
        client.GET('/categories', {
          params: {},
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      )
    },
    (): CategoriesError => ({
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

export function getCategoriesQueryOptions() {
  return {
    queryKey: queryKeys.categories.all,
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000 * 24 * 30, // 30 days
  }
}
