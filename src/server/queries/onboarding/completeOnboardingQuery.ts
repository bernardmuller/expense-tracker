import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

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

export type CompleteOnboardingResult = Awaited<ReturnType<typeof completeOnboardingQuery>>