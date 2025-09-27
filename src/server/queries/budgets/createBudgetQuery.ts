import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { budgets } from '@/db/schema'

export async function createBudgetQuery(data: {
  userId: string
  name: string
  startAmount: number
}) {
  await db
    .update(budgets)
    .set({
      isActive: false,
      updatedAt: new Date()
    })
    .where(eq(budgets.userId, data.userId))

  const [newBudget] = await db
    .insert(budgets)
    .values({
      userId: data.userId,
      name: data.name,
      startAmount: data.startAmount.toString(),
      currentAmount: data.startAmount.toString(),
      isActive: true,
    })
    .returning()

  return newBudget
}

export type CreateBudgetResult = Awaited<ReturnType<typeof createBudgetQuery>>