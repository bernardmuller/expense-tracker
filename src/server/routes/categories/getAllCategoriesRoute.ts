import { createServerFn } from '@tanstack/react-start'
import { getAllCategoriesQuery } from '@/server/queries/categories/getAllCategoriesQuery'

export const getAllCategoriesRoute = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await getAllCategoriesQuery()
  })