import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getExpenseByIdQuery } from '@/server/queries/expenses/getExpenseByIdQuery'

export const getExpenseByIdRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ expenseId: z.number() }))
  .handler(async ({ data }) => {
    return await getExpenseByIdQuery(data.expenseId)
  })