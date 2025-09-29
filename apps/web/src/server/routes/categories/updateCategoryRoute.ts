import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { updateCategoryQuery } from '@/server/queries/categories'

const updateCategoryDataSchema = z.object({
  categoryId: z.number(),
  label: z.string(),
  icon: z.string().optional()
})

export const updateCategoryRoute = createServerFn({ method: 'POST' })
  .validator(updateCategoryDataSchema)
  .handler(async ({ data }) => {
    return await updateCategoryQuery(data)
  })