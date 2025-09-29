import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { expenses } from '@/db/schema'

export async function getAllExpensesByBudgetIdQuery(data: {
  budgetId: number
  limit?: number
  offset?: number
}) {
  let query = db
    .select()
    .from(expenses)
    .where(and(
      isNull(expenses.deletedAt),
      eq(expenses.budgetId, data.budgetId)
    ))
    .orderBy(desc(expenses.createdAt))

  if (data.limit) {
    query = query.limit(data.limit)
  }

  if (data.offset) {
    query = query.offset(data.offset)
  }

  return await query
}

