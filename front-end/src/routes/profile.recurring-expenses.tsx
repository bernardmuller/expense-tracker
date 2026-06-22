import { Suspense } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Layout } from '@/components/layouts/Layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import RecurringExpenseTemplateList from '@/components/recurring-expense-template-list/RecurringExpenseTemplateList'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { getUserRecurringExpensesQueryOptions } from '@/lib/http/queries/recurring-expenses/getUserRecurringExpenses'
import { getCategoriesQueryOptions } from '@/lib/http/queries/categories'

export const Route = createFileRoute('/profile/recurring-expenses')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context }) => {
    const userIdResult = getUserIdFromAccessToken()
    if (userIdResult.isErr()) return
    const userId = userIdResult.value
    await Promise.all([
      context.queryClient.ensureQueryData(
        getUserRecurringExpensesQueryOptions(userId),
      ),
      context.queryClient.ensureQueryData(getCategoriesQueryOptions()),
    ])
  },
  component: RecurringExpensesProfilePage,
})

function RecurringExpensesProfilePage() {
  const router = useRouter()
  const userIdResult = getUserIdFromAccessToken()

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          onClick={() => router.history.back()}
          className="mr-4 aspect-square h-12 rounded-full"
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="text-2xl font-bold">Recurring Expenses</h1>
      </div>

      {userIdResult.isOk() ? (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <RecurringExpenseTemplateList userId={userIdResult.value} />
        </Suspense>
      ) : (
        <p className="text-muted-foreground text-sm">
          Unable to load your recurring expenses.
        </p>
      )}
    </Layout>
  )
}
