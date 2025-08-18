import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <button
          onClick={() => {
            authClient.signIn.social({
              provider: "google",
            })
          }}
        >Sign in</button>
      </header>
    </div>
  )
}
