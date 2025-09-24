import { and, count, desc, eq } from 'drizzle-orm'
import { db } from "@/db"
import { budgets, expenses } from "@/db/schema"

export async function getActiveBudgetByUserId(userId: string) {
  const [activeBudget] = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.isActive, true)
      )
    )
    .orderBy(desc(budgets.createdAt))
    .limit(1)

  const [expenseCount] = await db
    .select({ count: count() })
    .from(expenses)
    .where(
      eq(expenses.budgetId, activeBudget.id)
    )

  return {
    ...activeBudget,
    expenseCount: expenseCount.count
  }
}

export type ActiveBudgetByUserId = Awaited<ReturnType<typeof getActiveBudgetByUserId>>
