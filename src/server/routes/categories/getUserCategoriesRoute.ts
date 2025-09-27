import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getAllCategoriesByUserId } from '@/server/queries/categories/getAllCategoriesByUserId'

export const getUserCategoriesRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return await getAllCategoriesByUserId(data.userId)
  })