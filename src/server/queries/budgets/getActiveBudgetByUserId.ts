import { and, desc, eq } from 'drizzle-orm'
import { db } from "@/db"
import { budgets } from "@/db/schema"

export async function getActiveBudgetByUserId(userId: string) {
  const activeBudget = await db
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
  return activeBudget[0] || null
}
