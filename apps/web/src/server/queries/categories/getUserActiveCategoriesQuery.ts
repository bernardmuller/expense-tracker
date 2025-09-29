import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { categories, userCategories } from '@/db/schema'

export async function getUserActiveCategoriesQuery(userId: string) {
  const result = await db
    .selectDistinct({
      id: categories.id,
      key: categories.key,
      label: categories.label,
      icon: categories.icon,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      deletedAt: categories.deletedAt,
    })
    .from(userCategories)
    .innerJoin(categories, eq(userCategories.categoryId, categories.id))
    .where(
      and(
        eq(userCategories.userId, userId),
        isNull(userCategories.deletedAt),
        isNull(categories.deletedAt)
      )
    )
    .orderBy(categories.label)

  return result
}

