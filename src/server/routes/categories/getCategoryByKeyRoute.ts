import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getCategoryByKeyQuery } from '@/server/queries/categories/getCategoryByKeyQuery'

export const getCategoryByKeyRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ key: z.string() }))
  .handler(async ({ data }) => {
    return await getCategoryByKeyQuery(data.key)
  })