import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getActiveBudgetByUserId } from '@/server/queries/budgets'
import { getCategoryExpensesByBudgetId } from '@/server/queries/categories'


export const getActiveBudgetRoute = createServerFn({ method: 'GET' })
	.validator(z.object({ userId: z.string() }))
	.handler(async ({ data }) => {
		const budget = await getActiveBudgetByUserId(data.userId)
		const categories = await getCategoryExpensesByBudgetId(budget.id)

		return {
			budget,
			categories
		}
	})


