import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { budgets, expenses } from '@/db/schema'

export async function deleteExpenseQuery(expenseId: number) {
  return await db.transaction(async (tx) => {
    const [expense] = await tx
      .select()
      .from(expenses)
      .where(eq(expenses.id, expenseId))
      .limit(1)

    const [deletedExpense] = await tx
      .update(expenses)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(expenses.id, expenseId))
      .returning()

    const [currentBudget] = await tx
      .select()
      .from(budgets)
      .where(eq(budgets.id, expense.budgetId))
      .limit(1)

    const newCurrentAmount = parseFloat(currentBudget.currentAmount) + parseFloat(expense.amount)

    await tx
      .update(budgets)
      .set({
        currentAmount: newCurrentAmount.toString(),
        updatedAt: new Date()
      })
      .where(eq(budgets.id, expense.budgetId))

    return deletedExpense
  })
}

export type DeleteExpenseResult = Awaited<ReturnType<typeof deleteExpenseQuery>>