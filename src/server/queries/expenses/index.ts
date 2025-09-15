import { getRecentExpensesByBudgetId } from "./getRecentExpensesByBudgetId"

export type RecentExpensesByBudgetId = Awaited<ReturnType<typeof getRecentExpensesByBudgetId>>

export {
	getRecentExpensesByBudgetId,
}
