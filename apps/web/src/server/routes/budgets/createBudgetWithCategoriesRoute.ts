import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createBudgetWithCategoriesQuery } from '@/server/queries/budgets'

const createBudgetWithCategoriesSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, 'Budget name is required'),
  startAmount: z.number().positive('Start amount must be positive'),
  categoryAllocations: z.record(z.string(), z.number()).optional(),
})

export const createBudgetWithCategoriesRoute = createServerFn({ method: 'POST' })
  .validator(createBudgetWithCategoriesSchema)
  .handler(async ({ data }) => {
    return await createBudgetWithCategoriesQuery(data)
  })