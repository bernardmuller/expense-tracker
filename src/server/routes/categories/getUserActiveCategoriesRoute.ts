import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getUserActiveCategoriesQuery } from '@/server/queries/categories/getUserActiveCategoriesQuery'

export const getUserActiveCategoriesRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return await getUserActiveCategoriesQuery(data.userId)
  })