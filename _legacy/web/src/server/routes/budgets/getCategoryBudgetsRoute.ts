import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getCategoryBudgetsQuery } from '@/server/queries/budgets'

export const getCategoryBudgetsRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    return await getCategoryBudgetsQuery(data.budgetId)
  })