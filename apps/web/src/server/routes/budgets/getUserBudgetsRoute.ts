import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getUserBudgetsQuery } from '@/server/queries/budgets'

export const getUserBudgetsRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return await getUserBudgetsQuery(data.userId)
  })