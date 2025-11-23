import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/auth/route-guard'
import logo from '../logo.svg'
import { useAuth } from '@/lib/auth/auth-provider'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    requireAuth()
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
