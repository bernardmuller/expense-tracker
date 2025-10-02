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
  .handler(async (ctx) => {
    const { data } = ctx
    try {
      const session = await auth.api.getSession({
        headers: ctx.request?.headers || {}
      })

      if (!session) {
        throw new Error('You must be logged in to change your password')
      }

      await auth.api.changePassword({
        body: {
          newPassword: data.newPassword,
          currentPassword: data.currentPassword,
          revokeOtherSessions: data.revokeOtherSessions
        },
        headers: ctx.request?.headers || {}
      })

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
