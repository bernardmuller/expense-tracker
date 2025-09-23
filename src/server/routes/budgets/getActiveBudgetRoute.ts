import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import getActiveBudgetHandler from '@/server/handlers/budgets/getActiveBudget'


export const getActiveBudgetRoute = createServerFn({ method: 'GET' })
	.validator(z.object({ userId: z.string() }))
	.handler(async ({ data }) => {
		return getActiveBudgetHandler(data.userId)
	})


