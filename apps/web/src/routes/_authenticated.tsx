import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { useSession } from '@/lib/hooks'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { data: session, isLoading: sessionLoading } = useSession()
  const navigate = useNavigate()
  const router = useRouterState()

  console.log(session?.data?.user)

  useEffect(() => {
    if (typeof window === 'undefined') return // Skip on server

    if (!sessionLoading && !session?.data?.user) {
      const currentPath = router.location.pathname + router.location.search
      navigate({
        to: '/auth',
        search: { redirect: currentPath },
        replace: true,
      })
    } else if (!sessionLoading && session?.data?.user && !session.data.user.onboarded) {
      const currentPath = router.location.pathname
      if (!currentPath.startsWith('/onboarding')) {
        navigate({
          to: '/onboarding',
          replace: true,
        })
      }
    }
  }, [session, sessionLoading, navigate, router.location])

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

  if (!session?.data?.user) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex h-[70vh] justify-center items-center">
          <div className='flex flex-col gap-1'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return <Outlet />
}
