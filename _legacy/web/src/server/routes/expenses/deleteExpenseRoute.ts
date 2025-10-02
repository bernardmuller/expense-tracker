import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { deleteExpenseQuery } from '@/server/queries/expenses'

export const deleteExpenseRoute = createServerFn({ method: 'POST' })
  .validator(z.object({ expenseId: z.number() }))
  .handler(async ({ data }) => {
    return await deleteExpenseQuery(data.expenseId)
  })
