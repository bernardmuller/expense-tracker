import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getRecentExpensesByBudgetId } from '@/server/queries/expenses/getRecentExpensesByBudgetId'

export const getRecentExpensesRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    return await getRecentExpensesByBudgetId(data.budgetId)
  })