import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { userCategories } from '@/db/schema'

export async function removeUserCategoryQuery(data: {
  userId: string
  categoryId: number
}) {
  await db
    .update(userCategories)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userCategories.userId, data.userId),
        eq(userCategories.categoryId, data.categoryId)
      )
    )
}

export type RemoveUserCategoryResult = Awaited<ReturnType<typeof removeUserCategoryQuery>>