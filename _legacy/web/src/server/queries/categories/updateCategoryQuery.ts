import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'

export async function updateCategoryQuery(data: {
  categoryId: number
  label?: string
  icon?: string
}) {
  const [category] = await db
    .update(categories)
    .set({
      ...(data.label && { label: data.label }),
      ...(data.icon !== undefined && { icon: data.icon }),
      updatedAt: new Date(),
    })
    .where(eq(categories.id, data.categoryId))
    .returning()

  return category
}

