import { isNull } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'

export async function getAllCategoriesQuery() {
  return await db
    .select()
    .from(categories)
    .where(isNull(categories.deletedAt))
}

