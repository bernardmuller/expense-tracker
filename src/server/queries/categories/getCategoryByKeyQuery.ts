import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'

export async function getCategoryByKeyQuery(key: string) {
  const result = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.key, key),
        isNull(categories.deletedAt)
      )
    )
    .limit(1)

  return result[0] || null
}

export type CategoryByKey = Awaited<ReturnType<typeof getCategoryByKeyQuery>>