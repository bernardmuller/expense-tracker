import { useQuery } from '@tanstack/react-query'
import { getCategoriesQueryOptions } from '../queries/categories'
import type { paths } from '../schema'

type CategoriesRequestSuccess =
  paths['/categories']['get']['responses']['200']['content']['application/json']
export type Category = CategoriesRequestSuccess[0]

export function useCategories() {
  return useQuery({
    ...getCategoriesQueryOptions(),
  })
}
