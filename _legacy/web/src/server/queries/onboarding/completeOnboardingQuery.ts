import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function completeOnboardingQuery(userId: string) {
  return await db
    .update(users)
    .set({
      onboarded: true,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId))
    .returning()
}

