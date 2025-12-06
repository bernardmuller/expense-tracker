import AllExpenses from '@/components/all-expenses/AllExpenses'
import { Layout } from '@/components/layouts/Layout'
import RecentExpense from '@/components/recent-expenses/RecentExpense'
import { requireAuth } from '@/lib/auth/route-guard'
import { getBudgetExpensesQueryOptions } from '@/lib/http/queries/budgets/getBudgetExpenses'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import { BudgetExpensesSkeleton } from './budgets.expenses.skeleton'

export const Route = createFileRoute('/budgets/$id/expenses')({
  beforeLoad: () => requireAuth(),
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(getBudgetExpensesQueryOptions(params.id))
  },
  component: BudgetExpensesPage,
})

function BudgetExpensesPage() {
  return (
    <Suspense fallback={<BudgetExpensesSkeleton />}>
      <BudgetExpenses />
    </Suspense>
  )
}

function BudgetExpenses() {
  const { id } = Route.useParams()
  const { data: budget } = useSuspenseQuery(getBudgetExpensesQueryOptions(id))

  return (
    <AllExpenses
      budgetName={budget.name}
      linkProvider={({ children }) => (
        <Link to="/budgets/$id" params={{ id: budget.id }}>
          {children}
        </Link>
      )}
    >
      {budget.expenses.length === 0 && (
        <div className="text-muted-foreground p-8 text-center text-sm">
          No expenses found for this budget
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
    </AllExpenses>
  )
}
