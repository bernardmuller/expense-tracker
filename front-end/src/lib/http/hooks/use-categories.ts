import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'

type CategoriesRequestSuccess =
  paths['/categories']['get']['responses']['200']['content']['application/json']
export type Category = CategoriesRequestSuccess[0]

type CategoriesRequestError =
  paths['/categories']['get']['responses']['500']['content']['application/json']

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const result = await toResult(client.GET('/categories'))
      return result.match(
        (data) => {
          return data
        },
        (error) => {
          toast.error(error.message || 'Failed to get categories')
          throw error
        },
      )
    },
  })
}
