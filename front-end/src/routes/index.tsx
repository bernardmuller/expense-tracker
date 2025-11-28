import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserById } from '@/lib/http/api/users'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    requireAuth()

    const result = await getUserIdFromAccessToken().asyncAndThen((userId) =>
      getUserById(userId)(),
    )

    if (result.isErr()) {
      const error = result.error
      console.error('Failed to get user ID:', error)
      const errorMessage = typeof error === 'string' ? error : error.message
      throw new Error(errorMessage)
    }

    const user = result.value
    if (!user.onboarded) {
      throw redirect({ to: '/onboarding' })
    }

    throw redirect({ to: '/dashboard' })
  },
  component: App,
})

function App() {
  return <></>
}
