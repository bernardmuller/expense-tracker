import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { auth } from '@/lib/auth'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  revokeOtherSessions: z.boolean().optional().default(true)
})

export const changePasswordRoute = createServerFn({ method: 'POST' })
  .validator(changePasswordSchema)
  .handler(async ({ data, request }) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      })

      if (!session) {
        throw new Error('You must be logged in to change your password')
      }

      const result = await auth.api.changePassword({
        body: {
          newPassword: data.newPassword,
          currentPassword: data.currentPassword,
          revokeOtherSessions: data.revokeOtherSessions
        },
        headers: request.headers
      })

      if (!result) {
        throw new Error('Failed to change password')
      }

      return {
        success: true,
        message: 'Password changed successfully'
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('Failed to change password')
    }
  })
