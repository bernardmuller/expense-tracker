import { createExpenseQuery } from "./createExpenseQuery"
import { deleteExpenseQuery } from "./deleteExpenseQuery"
import { getAllExpensesByBudgetIdQuery } from "./getAllExpensesByBudgetIdQuery"
import { getExpenseByIdQuery } from "./getExpenseByIdQuery"
import { getExpenseCountQuery } from "./getExpenseCountQuery"
import { getRecentExpensesByBudgetId } from "./getRecentExpensesByBudgetId"

export type CreateExpenseResult = Awaited<ReturnType<typeof createExpenseQuery>>
export type DeleteExpenseResult = Awaited<ReturnType<typeof deleteExpenseQuery>>
export type AllExpensesByBudgetId = Awaited<ReturnType<typeof getAllExpensesByBudgetIdQuery>>
export type ExpenseById = Awaited<ReturnType<typeof getExpenseByIdQuery>>
export type ExpenseCount = Awaited<ReturnType<typeof getExpenseCountQuery>>
export type RecentExpensesByBudgetId = Awaited<ReturnType<typeof getRecentExpensesByBudgetId>>

export {
	createExpenseQuery,
	deleteExpenseQuery,
	getAllExpensesByBudgetIdQuery,
	getExpenseByIdQuery,
	getExpenseCountQuery,
	getRecentExpensesByBudgetId,
}
