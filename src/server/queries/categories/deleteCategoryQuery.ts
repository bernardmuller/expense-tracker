import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'

export async function deleteCategoryQuery(categoryId: number) {
  await db
    .update(categories)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(categories.id, categoryId))
}

