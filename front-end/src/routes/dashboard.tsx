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
  const createTransactionMutation = useCreateTransaction(budget.id)
  const isRefreshing = useMemo(
    () => (budgetFetching || categoriesFetching) && categories,
    [categories, budgetFetching, categoriesFetching],
  )
  const currentAmount = parseFloat(budget.currentAmount)
  const startAmount = parseFloat(budget.startAmount)
  const spentAmount = startAmount - currentAmount
  const spentPercentage = (spentAmount / startAmount) * 100

  console.log(categories)

  return (
    <>
      <RefreshIndicator isRefreshing={!!isRefreshing} />
      <Layout>
        <CurrentBudget
          budgetName={budget.name}
          currentAmount={formatCurrency(currentAmount, 'za')}
          startingAmount={formatCurrency(startAmount, 'za')}
          spentAmount={formatCurrency(spentAmount, 'za')}
          spentPercentage={spentPercentage}
          onClick={() => {}}
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
            <div className="divide-border divide-y">
              {budget.expenses.map((expense) => (
                <RecentExpense
                  key={expense.id}
                  amount={formatCurrency(parseFloat(expense.amount), 'za')}
                  description={expense.description}
                  emoji={expense.category.icon}
                  categoryLabel={expense.category.label}
                />
              ))}
            </div>
          )}
        </RecentExpenses>
      </Layout>
    </>
  )
}
