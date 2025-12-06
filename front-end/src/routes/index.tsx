import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserById } from '@/lib/http/api/users'
import { getActiveBudgetQueryOptions } from '@/lib/http/queries/budget'
import { getUserCategoriesQueryOptions } from '@/lib/http/queries/users/getUserCatgories'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    requireAuth()
    context.queryClient.prefetchQuery(getActiveBudgetQueryOptions())
    context.queryClient.prefetchQuery(getUserCategoriesQueryOptions())
    throw redirect({ to: '/dashboard' })
  },
  component: App,
})

function App() {
  return <></>
}
