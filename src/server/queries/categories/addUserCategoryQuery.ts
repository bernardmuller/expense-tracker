import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { userCategories } from '@/db/schema'

export async function addUserCategoryQuery(data: {
  userId: string
  categoryId: number
}) {
  const existingUserCategory = await db
    .select()
    .from(userCategories)
    .where(
      and(
        eq(userCategories.userId, data.userId),
        eq(userCategories.categoryId, data.categoryId)
      )
    )
    .limit(1)

  if (existingUserCategory.length > 0) {
    const existing = existingUserCategory[0]
    if (existing.deletedAt) {
      const [reactivated] = await db
        .update(userCategories)
        .set({
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(userCategories.id, existing.id))
        .returning()

      return reactivated
    }
    return existing
  }

  const [userCategory] = await db
    .insert(userCategories)
    .values({
      userId: data.userId,
      categoryId: data.categoryId,
    })
    .returning()

  return userCategory
}

export type AddUserCategoryResult = Awaited<ReturnType<typeof addUserCategoryQuery>>