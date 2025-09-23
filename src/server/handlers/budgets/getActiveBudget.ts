import type { ActiveBudgetByUserId } from "@/server/queries/budgets/getActiveBudgetByUserId";
import type { CategoryExpensesByBudgetId } from "@/server/queries/categories/getCategoryExpensesByBudgetId";
import { getActiveBudgetByUserId } from "@/server/queries/budgets/getActiveBudgetByUserId";
import getCategoryExpensesByBudgetId from "@/server/queries/categories/getCategoryExpensesByBudgetId";

function extract({
	budget,
	categories
}: {
	budget: ActiveBudgetByUserId
	categories: CategoryExpensesByBudgetId
}) {
	return {
		budget,
		categories
	}
}

export default async function getActiveBudgetHandler(userId: string) {
	const budget = await getActiveBudgetByUserId(userId)

	const categories = await getCategoryExpensesByBudgetId(budget.id)


	const data = extract({
		budget,
		categories
	})
	return data
}

export type TActiveBudget = Awaited<ReturnType<typeof extract>>
