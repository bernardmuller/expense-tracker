import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { budgets } from '@/db/schema'

export async function getUserBudgetsQuery(userId: string) {
  return await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId))
    .orderBy(desc(budgets.createdAt))
}

export type UserBudgets = Awaited<ReturnType<typeof getUserBudgetsQuery>>