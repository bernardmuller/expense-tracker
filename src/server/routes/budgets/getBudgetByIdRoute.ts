import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getBudgetByIdQuery } from '@/server/queries/budgets'

export const getBudgetByIdRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    return await getBudgetByIdQuery(data.budgetId)
  })