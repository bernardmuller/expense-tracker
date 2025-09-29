import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { budgets } from '@/db/schema'

export async function getBudgetByIdQuery(budgetId: number) {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.id, budgetId))
    .limit(1)

  return budget
}

