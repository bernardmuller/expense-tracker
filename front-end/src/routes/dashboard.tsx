import { createFileRoute, redirect } from '@tanstack/react-router'
import AddExpenseForm from '@/components/add-expense-form/AddExpenseForm'
import { CurrentBudget } from '@/components/current-budget/CurrentBudget'
import RecentExpenses from '@/components/recent-expenses/RecentExpenses'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserById } from '@/lib/http/api/users'
import { useActiveBudget } from '@/lib/http/hooks/use-active-budget'
import { useCategories } from '@/lib/http/hooks/use-categories'
import { useCreateTransaction } from '@/lib/http/hooks/use-create-transaction'
import { getActiveBudgetQueryOptions } from '@/lib/http/queries/budget'
import { getCategoriesQueryOptions } from '@/lib/http/queries/categories'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { LoaderCircleIcon } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    requireAuth()

    const result = await getUserIdFromAccessToken().asyncAndThen((userId) =>
      getUserById(userId)(),
    )

    if (result.isErr()) {
      const error = result.error
      const errorMessage = typeof error === 'string' ? error : error.message
      throw new Error(errorMessage)
    }

    const user = result.value
    if (!user.onboarded) {
      throw redirect({ to: '/onboarding' })
    }
  },
  loader: async ({ context }) => {
    const promises = [
      context.queryClient.ensureQueryData(getActiveBudgetQueryOptions()),
      context.queryClient.ensureQueryData(getCategoriesQueryOptions()),
    ]

    await Promise.all(promises)
  },
  component: DashboardPage,
})

function DashboardPage() {
  const {
    data: budget,
    isLoading: budgetLoading,
    isFetching: budgetFetching,
    error: budgetError,
  } = useActiveBudget()

  const {
    data: categories,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
    error: categoriesError,
  } = useCategories()

  const createTransactionMutation = useCreateTransaction(budget?.id ?? '')

  const isInitialLoading =
    (budgetLoading || categoriesLoading) && (!budget || !categories)
  const isRefreshing =
    (budgetFetching || categoriesFetching) && budget && categories

  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoaderCircleIcon className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (budgetError || categoriesError) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
      >
        <div className="text-destructive text-center">
          {budgetError
            ? 'Failed to load budget. Please try again.'
            : 'Failed to load categories. Please try again.'}
        </div>
      </div>
    )
  }

  if (!budget || !categories) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
      >
        <div className="text-muted-foreground text-center">
          No active budget found
        </div>
      </div>
    )
  }

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
      {/* Subtle refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className="flex items-center gap-2 rounded-lg bg-white px-3 py-2
              text-sm shadow-md"
          >
            <LoaderCircleIcon className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-gray-600">Updating...</span>
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
          categories={categoryFilterItems.map((c) => ({
            name: c.label,
            value: c.value,
          }))}
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
