import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { expenses } from '@/db/schema'

export async function getExpenseByIdQuery(expenseId: number) {
  const [expense] = await db
    .select()
    .from(expenses)
    .where(and(
      isNull(expenses.deletedAt),
      eq(expenses.id, expenseId)
    ))
    .limit(1)

  return expense || null
}

