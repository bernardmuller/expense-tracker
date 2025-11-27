import { createFileRoute, redirect } from '@tanstack/react-router'
import { requireAuth } from '@/lib/auth/route-guard'
import logo from '../logo.svg'
import { useAuth } from '@/lib/auth/auth-provider'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
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
  },
  component: App,
})

function App() {
  const auth = useAuth()

  if (auth.isLoading) return 'loading...'
  return (
    <div className="text-center">
      <header
        className="flex min-h-screen flex-col items-center justify-center
          bg-[#282c34] text-[calc(10px+2vmin)] text-white"
      >
        <img
          src={logo}
          className="pointer-events-none h-[40vmin]
            animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
    </div>
  )
}
