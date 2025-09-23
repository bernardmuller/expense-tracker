import { eq, sql, sum } from "drizzle-orm"
import { db } from "@/db"
import { categories, categoryBudgets, expenses, userCategories } from "@/db/schema"

export default async function getCategoryExpensesByBudgetId(id: number) {
	const subquery = db
		.select({
			key: expenses.category,
			spent: sum(expenses.amount).as('spent'),
			budgetId: expenses.budgetId
		})
		.from(expenses)
		.where(eq(expenses.budgetId, id))
		.groupBy(expenses.category, expenses.budgetId)
		.as('spent')

	const result = await db
		.select({
			id: categories.id,
			key: categories.key,
			name: categories.label,
			icon: categories.icon,
			spent: subquery.spent,
			planned: categoryBudgets.allocatedAmount
		})
		.from(userCategories)
		.innerJoin(categories, eq(userCategories.categoryId, categories.id))
		.innerJoin(categoryBudgets, eq(categories.id, categoryBudgets.categoryId))
		.leftJoin(subquery, eq(subquery.key, categories.key)) // Changed to leftJoin
		.groupBy(categories.key, categoryBudgets.allocatedAmount, categories.label, categories.icon, categories.id, subquery.spent)

	// Handle null spent values in JavaScript
	return result.map(item => ({
		...item,
		spent: item.spent ? parseFloat(item.spent.toString()) : 0
	}));
}

export type CategoryExpensesByBudgetId = Awaited<ReturnType<typeof getCategoryExpensesByBudgetId>>
