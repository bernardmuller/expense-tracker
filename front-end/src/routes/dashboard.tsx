import AddExpenseForm from '@/components/add-expense-form/AddExpenseForm'
import { CurrentBudget } from '@/components/current-budget/CurrentBudget'
import { Layout } from '@/components/layouts/Layout'
import RecentExpenses from '@/components/recent-expenses/RecentExpenses'
import { RefreshIndicator } from '@/components/refresh-indicator/RefreshIndicator'
import { requireAuth } from '@/lib/auth/route-guard'
import { useCreateTransaction } from '@/lib/http/hooks/use-create-transaction'
import { getActiveBudgetQueryOptions } from '@/lib/http/queries/budget'
import { getCategoriesQueryOptions } from '@/lib/http/queries/categories'
import { getUserByIdQueryOptions } from '@/lib/http/queries/users/getUserById'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Suspense, useMemo } from 'react'
import { DashboardSkeleton } from './dashboard.skeleton'
import RecentExpense from '@/components/recent-expenses/RecentExpense'
import { Button } from '@/components/ui/button'
import { Trash2, UserCircle } from 'lucide-react'
import { Swiper } from '@/components/swiper'
import { useDeleteExpense } from '@/lib/http/hooks/use-delete-expense'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'

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
    <Suspense fallback={<DashboardSkeleton />}>
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
  const { data: user } = useSuspenseQuery(getUserByIdQueryOptions())
  const createTransactionMutation = useCreateTransaction(budget.id)
  const deleteExpenseMutation = useDeleteExpense()
  const isRefreshing = useMemo(
    () => (budgetFetching || categoriesFetching) && categories,
    [categories, budgetFetching, categoriesFetching],
  )

  const userIdResult = getUserIdFromAccessToken()
  const userId = userIdResult.isOk() ? userIdResult.value : ''
  const currentAmount = parseFloat(budget.currentAmount)
  const startAmount = parseFloat(budget.startAmount)
  const spentAmount = startAmount - currentAmount
  const spentPercentage = (spentAmount / startAmount) * 100

  return (
    <>
      <RefreshIndicator isRefreshing={!!isRefreshing} />
      <Layout>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="bg-background flex h-12 w-12 items-center
                justify-center rounded-full border"
            >
              <img src="/favicon.ico" alt="App Icon" className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Expense Tracker</span>
              <span className="text-muted-foreground text-xs">
                Hi, {user.name}!
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            asChild
            className="aspect-square h-12 rounded-full"
          >
            <Link to="/profile">
              <UserCircle />
            </Link>
          </Button>
        </div>
        <CurrentBudget
          budgetName={budget.name}
          currentAmount={formatCurrency(currentAmount, 'za')}
          startingAmount={formatCurrency(startAmount, 'za')}
          spentAmount={formatCurrency(spentAmount, 'za')}
          spentPercentage={spentPercentage}
          linkProvider={({ children }) => (
            <Link to="/budgets/$id" params={{ id: budget.id }}>
              {children}
            </Link>
          )}
        />
        <AddExpenseForm
          onSubmit={(value) =>
            createTransactionMutation.mutate({
              description: value.description,
              amount: value.amount,
              categoryId: value.category,
            })
          }
          categories={categories
            .map((c) => ({
              label: c.label,
              value: c.id,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))}
        />
        <RecentExpenses
          linkProvider={({ children }) => (
            <Link to="/budgets/$id/expenses" params={{ id: budget.id }}>
              {children}
            </Link>
          )}
        >
          {budget.expenses.length === 0 && (
            <div className="text-muted-foreground p-8 text-center text-sm">
              No recent expenses
            </div>
          )}
          {budget.expenses.length > 0 && (
            <div>
              {budget.expenses.map((expense) => (
                <Swiper
                  key={expense.id}
                  rightAction={{
                    content: <Trash2 className="h-5 w-5 text-white" />,
                    className: 'p-2 rounded-md',
                    backgroundColor: 'oklch(0.6368 0.2078 25.3313)',
                    width: '80px',
                    onAction: () => {
                      deleteExpenseMutation.mutate({
                        userId,
                        budgetId: budget.id,
                        expenseId: expense.id,
                      })
                    },
                  }}
                >
                  <RecentExpense
                    amount={formatCurrency(parseFloat(expense.amount), 'za')}
                    description={expense.description}
                    emoji={expense.category.icon}
                    categoryLabel={expense.category.label}
                  />
                </Swiper>
              ))}
            </div>
          )}
        </RecentExpenses>
      </Layout>
    </>
  )
}
