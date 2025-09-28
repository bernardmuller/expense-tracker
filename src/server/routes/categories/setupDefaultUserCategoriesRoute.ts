import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { setupDefaultUserCategoriesQuery } from '@/server/queries/categories'

export const setupDefaultUserCategoriesRoute = createServerFn({ method: 'POST' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return await setupDefaultUserCategoriesQuery(data.userId)
  })