import { db } from '@/db'
import { userCategories } from '@/db/schema'
import { getAllCategoriesQuery } from './getAllCategoriesQuery'
import { defaultUserCategories } from '@/db/seed-categories'

export async function setupDefaultUserCategoriesQuery(userId: string) {
  const allCategories = await getAllCategoriesQuery()
  const defaultCategories = allCategories.filter(cat =>
    defaultUserCategories.includes(cat.key)
  )

  const userCategoryPromises = defaultCategories.map(async category =>
    await db
      .insert(userCategories)
      .values({
        userId: userId,
        categoryId: category.id,
      })
      .returning()
  )

  return Promise.all(userCategoryPromises)
}

export type SetupDefaultUserCategoriesResult = Awaited<ReturnType<typeof setupDefaultUserCategoriesQuery>>