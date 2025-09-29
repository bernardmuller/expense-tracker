import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { completeOnboardingQuery } from '@/server/queries/onboarding'

const completeOnboardingSchema = z.object({
  userId: z.string(),
})

export const completeOnboardingRoute = createServerFn({ method: 'POST' })
  .validator(completeOnboardingSchema)
  .handler(async ({ data }) => {
    return await completeOnboardingQuery(data.userId)
  })
