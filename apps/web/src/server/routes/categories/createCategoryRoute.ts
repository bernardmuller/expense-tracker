import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createCategoryQuery } from '@/server/queries/categories'

const createCategoryDataSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string().optional()
})

export const createCategoryRoute = createServerFn({ method: 'POST' })
  .validator(createCategoryDataSchema)
  .handler(async ({ data }) => {
    return await createCategoryQuery(data)
  })