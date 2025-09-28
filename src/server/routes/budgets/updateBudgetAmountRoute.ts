import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { updateBudgetAmountQuery } from '@/server/queries/budgets'

const updateBudgetAmountSchema = z.object({
  budgetId: z.number(),
  amount: z.number(),
})

export const updateBudgetAmountRoute = createServerFn({ method: 'POST' })
  .validator(updateBudgetAmountSchema)
  .handler(async ({ data }) => {
    return await updateBudgetAmountQuery(data)
  })