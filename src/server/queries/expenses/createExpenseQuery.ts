import { db } from '@/db'
import { budgets, expenses } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createExpenseQuery(data: {
  budgetId: number
  description: string
  amount: number
  category: string
}) {
  return await db.transaction(async (tx) => {
    const [newExpense] = await tx
      .insert(expenses)
      .values({
        budgetId: data.budgetId,
        description: data.description,
        amount: data.amount.toString(),
        category: data.category,
      })
      .returning()

    const [currentBudget] = await tx
      .select()
      .from(budgets)
      .where(eq(budgets.id, data.budgetId))
      .limit(1)

    const newCurrentAmount = parseFloat(currentBudget.currentAmount) - data.amount

    await tx
      .update(budgets)
      .set({
        currentAmount: newCurrentAmount.toString(),
        updatedAt: new Date()
      })
      .where(eq(budgets.id, data.budgetId))

    return {
      expense: newExpense,
      newBudgetAmount: newCurrentAmount
    }
  })
}

export type CreateExpenseResult = Awaited<ReturnType<typeof createExpenseQuery>>