import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Toaster } from '../components/ui/sonner'
import { ErrorBoundary } from '../components/error-boundary'
import { StreakCheckIn } from '../components/streak-check-in/StreakCheckIn'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <StreakCheckIn />
      <Outlet />
      <Toaster />
    </>
  ),
  errorComponent: ErrorBoundary,
})
