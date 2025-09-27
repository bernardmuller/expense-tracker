import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { budgets } from '@/db/schema'

export async function updateBudgetAmountQuery(data: {
  budgetId: number
  amount: number
}) {
  const [updatedBudget] = await db
    .update(budgets)
    .set({
      currentAmount: data.amount.toString(),
      updatedAt: new Date()
    })
    .where(eq(budgets.id, data.budgetId))
    .returning()

  return updatedBudget
}

export type UpdateBudgetAmountResult = Awaited<ReturnType<typeof updateBudgetAmountQuery>>