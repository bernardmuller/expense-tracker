import AddExpenseForm from '@/components/add-expense-form/AddExpenseForm'
import { CurrentBudget } from '@/components/current-budget/CurrentBudget'
import RecentExpenses from '@/components/recent-expenses/RecentExpenses'
import { requireAuth } from '@/lib/auth/route-guard'
import { useCreateTransaction } from '@/lib/http/hooks/use-create-transaction'
import { getActiveBudgetQueryOptions } from '@/lib/http/queries/budget'
import { getCategoriesQueryOptions } from '@/lib/http/queries/categories'
import { getUserByIdQueryOptions } from '@/lib/http/queries/users/getUserById'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { LoaderCircleIcon } from 'lucide-react'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(getActiveBudgetQueryOptions())
    context.queryClient.prefetchQuery(getCategoriesQueryOptions())
    await context.queryClient.ensureQueryData(getUserByIdQueryOptions())
  },
  component: DashboardPage,
})

function DashboardPage() {
  const router = useRouter()
  const data = useSuspenseQuery(getUserByIdQueryOptions())

  if (!data.data.onboarded) {
    router.navigate({ to: '/onboarding' })
  }

  return (
    <Suspense
      fallback={
        <div className="text-black">
          <span>Loading...</span>
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  )
}

function Dashboard() {
  const { data: budget, isFetching: budgetFetching } = useSuspenseQuery(
    getActiveBudgetQueryOptions(),
  )
  const { data: categories, isFetching: categoriesFetching } = useSuspenseQuery(
    getCategoriesQueryOptions(),
  )
  const createTransactionMutation = useCreateTransaction(budget.id)
  const isRefreshing = (budgetFetching || categoriesFetching) && categories
  const currentAmount = parseFloat(budget.currentAmount)
  const startAmount = parseFloat(budget.startAmount)
  const spentAmount = startAmount - currentAmount
  const spentPercentage = (spentAmount / startAmount) * 100

  const handleExpenseSubmit = (value: {
    description: string
    amount: number
    category: string
  }) => {
    createTransactionMutation.mutate({
      description: value.description,
      amount: value.amount,
      categoryId: value.category,
    })
  }

  const categoryFilterItems = categories.map((cat) => ({
    value: cat.id,
    label: cat.label,
  }))

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
    >
      {isRefreshing && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className="flex items-center gap-2 rounded-lg bg-white px-3 py-2
              text-sm shadow-md"
          >
            <LoaderCircleIcon className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-gray-600">Refreshing...</span>
          </div>
        </div>
      )}
      <div className="w-full max-w-md space-y-4">
        <CurrentBudget
          budgetName={budget.name}
          currentAmount={formatCurrency(currentAmount, 'za')}
          startingAmount={formatCurrency(startAmount, 'za')}
          spentAmount={formatCurrency(spentAmount, 'za')}
          spentPercentage={spentPercentage}
          onClick={() => {}}
          linkProvider={({ children }) => (
            <span className="cursor-pointer">{children}</span>
          )}
        />
        <AddExpenseForm
          onSubmit={handleExpenseSubmit}
          categories={categoryFilterItems
            .map((c) => ({
              name: c.label,
              value: c.value,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))}
        />
        <RecentExpenses
          linkProvider={({ children }) => (
            <span className="cursor-pointer">{children}</span>
          )}
        >
          {budget.expenses.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center text-sm">
              No recent expenses
            </div>
          ) : (
            <div className="divide-border divide-y">
              {budget.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center
                        rounded-full bg-gray-100"
                    >
                      <span className="text-lg">{expense.category.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {expense.description}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {expense.category.label}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatCurrency(parseFloat(expense.amount), 'za')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </RecentExpenses>
      </div>
    </div>
  )
}
