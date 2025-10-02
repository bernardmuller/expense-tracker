import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { categories, categoryBudgets } from '@/db/schema'

export async function getCategoryBudgetsQuery(budgetId: number) {
  return await db
    .select({
      id: categoryBudgets.id,
      budgetId: categoryBudgets.budgetId,
      categoryId: categoryBudgets.categoryId,
      allocatedAmount: categoryBudgets.allocatedAmount,
      category: {
        id: categories.id,
        key: categories.key,
        label: categories.label,
        icon: categories.icon,
      }
    })
    .from(categoryBudgets)
    .leftJoin(categories, eq(categoryBudgets.categoryId, categories.id))
    .where(eq(categoryBudgets.budgetId, budgetId))
}

