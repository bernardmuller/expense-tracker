import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getExpenseCountQuery } from '@/server/queries/expenses'

export const getExpenseCountRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    return await getExpenseCountQuery(data.budgetId)
  })