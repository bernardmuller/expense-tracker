import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getActiveBudgetByUserId } from '@/server/queries/budgets'

export const getActiveBudgetOnlyRoute = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return await getActiveBudgetByUserId(data.userId)
  })