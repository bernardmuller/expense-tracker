import { db } from '@/db'
import { categories } from '@/db/schema'

export async function createCategoryQuery(data: {
  key: string
  label: string
  icon?: string
}) {
  const [category] = await db
    .insert(categories)
    .values({
      key: data.key,
      label: data.label,
      icon: data.icon || '',
    })
    .returning()

  return category
}

export type CreateCategoryResult = Awaited<ReturnType<typeof createCategoryQuery>>