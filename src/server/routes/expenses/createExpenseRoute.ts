import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createExpenseQuery } from '@/server/queries/expenses/createExpenseQuery'

const createExpenseSchema = z.object({
  budgetId: z.number(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
})

export const createExpenseRoute = createServerFn({ method: 'POST' })
  .validator(createExpenseSchema)
  .handler(async ({ data }) => {
    return await createExpenseQuery(data)
  })