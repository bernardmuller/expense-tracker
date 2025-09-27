import { eq, sum, and } from "drizzle-orm"
import { db } from "@/db"
import { categories, categoryBudgets, expenses, budgets, userCategories } from "@/db/schema"

export default async function getCategoryExpensesByBudgetId(id: number) {
	const result = await db
		.select({
			id: categories.id,
			key: categories.key,
			name: categories.label,
			icon: categories.icon,
			planned: categoryBudgets.allocatedAmount,
		})
		.from(budgets)
		.innerJoin(userCategories, eq(budgets.userId, userCategories.userId))
		.innerJoin(categories, eq(userCategories.categoryId, categories.id))
		.leftJoin(categoryBudgets, and(eq(categoryBudgets.categoryId, categories.id), eq(categoryBudgets.budgetId, id)))
		.where(eq(budgets.id, id))
		.groupBy(categories.id, categories.key, categories.label, categories.icon, categoryBudgets.allocatedAmount)

	const expensesByCategory = await db
		.select({
			category: expenses.category,
			spent: sum(expenses.amount).as('spent'),
		})
		.from(expenses)
		.where(eq(expenses.budgetId, id))
		.groupBy(expenses.category)

	const expensesMap = new Map(
		expensesByCategory.map(item => [
			item.category,
			parseFloat(item.spent?.toString() || '0')
		])
	)

	return result.map(item => ({
		...item,
		spent: expensesMap.get(item.key) || 0,
		planned: item.planned ? parseFloat(item.planned.toString()) : 0
	}));
}

export type CategoryExpensesByBudgetId = Awaited<ReturnType<typeof getCategoryExpensesByBudgetId>>
