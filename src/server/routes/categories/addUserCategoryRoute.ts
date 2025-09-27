import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { addUserCategoryQuery } from '@/server/queries/categories/addUserCategoryQuery'

const userCategoryDataSchema = z.object({
  userId: z.string(),
  categoryId: z.number(),
})

export const addUserCategoryRoute = createServerFn({ method: 'POST' })
  .validator(userCategoryDataSchema)
  .handler(async ({ data }) => {
    return await addUserCategoryQuery(data)
  })