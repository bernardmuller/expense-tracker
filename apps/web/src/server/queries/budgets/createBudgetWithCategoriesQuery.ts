import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { budgets, categoryBudgets } from '@/db/schema'

export async function createBudgetWithCategoriesQuery(data: {
  userId: string
  name: string
  startAmount: number
  categoryAllocations?: Record<string, number>
}) {
  const result = await db.transaction(async (tx) => {
    await tx
      .update(budgets)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(budgets.userId, data.userId))

    const [newBudget] = await tx
      .insert(budgets)
      .values({
        userId: data.userId,
        name: data.name,
        startAmount: data.startAmount.toString(),
        currentAmount: data.startAmount.toString(),
        isActive: true,
      })
      .returning()

    if (data.categoryAllocations && Object.keys(data.categoryAllocations).length > 0) {
      const categoryBudgetInserts = Object.entries(data.categoryAllocations).map(([categoryIdStr, amount]) => ({
        budgetId: newBudget.id,
        categoryId: parseInt(categoryIdStr),
        allocatedAmount: amount.toString(),
      }))

      await tx
        .insert(categoryBudgets)
        .values(categoryBudgetInserts)
    }

    return newBudget
  })

  return result
}

