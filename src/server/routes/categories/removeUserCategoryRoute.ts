import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { removeUserCategoryQuery } from '@/server/queries/categories/removeUserCategoryQuery'

const userCategoryDataSchema = z.object({
  userId: z.string(),
  categoryId: z.number(),
})

export const removeUserCategoryRoute = createServerFn({ method: 'POST' })
  .validator(userCategoryDataSchema)
  .handler(async ({ data }) => {
    return await removeUserCategoryQuery(data)
  })