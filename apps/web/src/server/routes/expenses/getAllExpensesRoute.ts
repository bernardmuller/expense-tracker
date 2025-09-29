import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getAllExpensesByBudgetIdQuery } from '@/server/queries/expenses'

export const getAllExpensesRoute = createServerFn({ method: 'GET' })
  .validator(z.object({
    budgetId: z.number(),
    limit: z.number().optional(),
    offset: z.number().optional()
  }))
  .handler(async ({ data }) => {
    return await getAllExpensesByBudgetIdQuery(data)
  })