import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createBudgetQuery } from '@/server/queries/budgets/createBudgetQuery'

const createBudgetSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, 'Budget name is required'),
  startAmount: z.number().positive('Start amount must be positive'),
})

export const createBudgetRoute = createServerFn({ method: 'POST' })
  .validator(createBudgetSchema)
  .handler(async ({ data }) => {
    return await createBudgetQuery(data)
  })