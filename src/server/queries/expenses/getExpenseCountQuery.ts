import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { expenses } from '@/db/schema'

export async function getExpenseCountQuery(budgetId: number) {
  const result = await db
    .select({ count: expenses.id })
    .from(expenses)
    .where(and(
      isNull(expenses.deletedAt),
      eq(expenses.budgetId, budgetId)
    ))

  return result.length
}

export type ExpenseCount = Awaited<ReturnType<typeof getExpenseCountQuery>>