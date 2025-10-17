import { eq, sum, and } from "drizzle-orm"
  import { db } from "@/db"
  import { budgets, categories, categoryBudgets, expenses, userCategories } from "@/db/schema"

  export default async function getCategoryExpensesByBudgetId(id: number) {
  	const budget = await db.select({ userId: budgets.userId }).from(budgets).where(eq(budgets.id, id)).limit(1)
  	const userId = budget[0]?.userId

  	if (!userId) {
  		return []
  	}

  	const result = await 
  		.select({
  			id: categories.id,
  			key: categories.key,
  			name: categories.label,
  			icon: categories.icon,
  			planned: categoryBudgets.allocatedAmount,
  		})
  		.from(userCategories)
  		.innerJoin(categories, eq(userCategories.categoryId, categories.id))
  		.leftJoin(categoryBudgets, and(
  			eq(categories.id, categoryBudgets.categoryId),
  			eq(categoryBudgets.budgetId, id)
  		))
  		.where(eq(userCategories.userId, userId))
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
