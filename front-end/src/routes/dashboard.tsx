import AddExpenseForm from '@/components/add-expense-form/AddExpenseForm'
import { CurrentBudget } from '@/components/current-budget/CurrentBudget'
import RecentExpenses from '@/components/recent-expenses/RecentExpenses'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserById } from '@/lib/http/api/users'
import { useActiveBudget } from '@/lib/http/hooks/use-active-budget'
import { useCreateTransaction } from '@/lib/http/hooks/use-create-transaction'
import { useUserCategories } from '@/lib/http/hooks/use-user-categories'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
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
  component: DashboardPage,
})

function DashboardPage() {
  const {
    data: budget,
    isLoading: budgetLoading,
    error: budgetError,
  } = useActiveBudget()

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useUserCategories()

  const createTransactionMutation = useCreateTransaction(budget?.id ?? '')

  if (budgetLoading || categoriesLoading) {
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
      <div className="w-full max-w-md space-y-4">
        <CurrentBudget
          budgetName={budget.name}
          currentAmount={formatCurrency(currentAmount, 'za')}
          startingAmount={formatCurrency(startAmount, 'za')}
          spentAmount={formatCurrency(spentAmount, 'za')}
          spentPercentage={spentPercentage}
          onClick={() => {}}
          linkProvider={({ children }) => (
            <Link to="/budget" className="cursor-pointer">
              {children}
            </Link>
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
            <Link to="/expenses" className="cursor-pointer">
              {children}
            </Link>
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
