import { getAllCategoriesQuery } from '../categories/getAllCategoriesQuery'
import { db } from '@/db'
import { userCategories } from '@/db/schema'

export async function createUserCategoriesQuery(userId: string, categoryKeys: Array<string>) {
  const allCategories = await getAllCategoriesQuery()
  const selectedCategories = allCategories.filter(cat =>
    categoryKeys.includes(cat.key)
  )

  const userCategoryPromises = selectedCategories.map(async category =>
    await db
      .insert(userCategories)
      .values({
        userId: userId,
        categoryId: category.id,
      })
      .onConflictDoNothing()
      .returning()
  )

  return Promise.all(userCategoryPromises)
}

