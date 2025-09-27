import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import AuthForm from '../components/AuthForm'
import AppLayout from '../components/AppLayout'
import { useSession } from '@/lib/hooks'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || '/',
    }
  },
})

function AuthPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { redirect } = Route.useSearch()
  const { data: session, isLoading: sessionLoading } = useSession()

  useEffect(() => {
    if (session?.data?.user && !sessionLoading) {
      navigate({ to: redirect })
    }
  }, [session, sessionLoading, navigate, redirect])

  const handleAuthSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  if (sessionLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex h-[70vh] justify-center items-center">
          <div className='flex flex-col gap-1'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (session?.data?.user) {
    return null
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </AppLayout>
  )
}