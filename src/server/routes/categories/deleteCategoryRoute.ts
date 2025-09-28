import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { deleteCategoryQuery } from '@/server/queries/categories'

export const deleteCategoryRoute = createServerFn({ method: 'POST' })
  .validator(z.object({ categoryId: z.number() }))
  .handler(async ({ data }) => {
    return await deleteCategoryQuery(data.categoryId)
  })