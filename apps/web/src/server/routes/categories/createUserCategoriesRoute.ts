import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createUserCategoriesQuery } from '@/server/queries/onboarding'

const createUserCategoriesSchema = z.object({
  userId: z.string(),
  categoryKeys: z.array(z.string()),
})

export const createUserCategoriesRoute = createServerFn({ method: 'POST' })
  .validator(createUserCategoriesSchema)
  .handler(async ({ data }) => {
    return await createUserCategoriesQuery(data.userId, data.categoryKeys)
  })