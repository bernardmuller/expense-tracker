import { and, eq, sum, sql } from "drizzle-orm"
import { db } from "@/db"
import { budgets, categories, categoryBudgets, expenses, userCategories } from "@/db/schema"

export default async function getCategoryExpensesByBudgetId(id: number) {
	// First, get the budget to find the userId
	const budget = await db
		.select({ userId: budgets.userId })
		.from(budgets)
		.where(eq(budgets.id, id))
		.limit(1)
	
	if (!budget.length) {
		return []
	}
	
	const userId = budget[0].userId
	
	// Get all unique categories for this user with their budget allocations
	const result = await db
		.selectDistinct({
			id: categories.id,
			key: categories.key,
			name: categories.label,
			icon: categories.icon,
			planned: categoryBudgets.allocatedAmount,
		})
		.from(userCategories)
		.innerJoin(categories, eq(userCategories.categoryId, categories.id))
		.leftJoin(
			categoryBudgets, 
			and(
				eq(categoryBudgets.categoryId, categories.id), 
				eq(categoryBudgets.budgetId, id)
			)
		)
		.where(eq(userCategories.userId, userId))
	
	// Get total expenses by category for this budget
	const expensesByCategory = await db
		.select({
			category: expenses.category,
			spent: sum(expenses.amount).as('spent'),
		})
		.from(expenses)
		.where(eq(expenses.budgetId, id))
		.groupBy(expenses.category)
	
	// Create a map for quick lookup
	const expensesMap = new Map(
		expensesByCategory.map(item => [
			item.category,
			parseFloat(item.spent?.toString() || '0')
		])
	)
	
	// Merge the data and ensure uniqueness
	const uniqueCategories = new Map()
	
	for (const item of result) {
		if (!uniqueCategories.has(item.id)) {
			uniqueCategories.set(item.id, {
				...item,
				spent: expensesMap.get(item.key) || 0,
				planned: item.planned ? parseFloat(item.planned.toString()) : 0
			})
		}
	}
	
	return Array.from(uniqueCategories.values())
}
