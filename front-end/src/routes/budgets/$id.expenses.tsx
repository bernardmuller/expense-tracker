import AllExpenses from '@/components/all-expenses/AllExpenses'
import { Layout } from '@/components/layouts/Layout'
import RecentExpense from '@/components/recent-expenses/RecentExpense'
import { requireAuth } from '@/lib/auth/route-guard'
import { getBudgetExpensesQueryOptions } from '@/lib/http/queries/budgets/getBudgetExpenses'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense, useState, useEffect } from 'react'
import { BudgetExpensesSkeleton } from './budgets.expenses.skeleton'
import { Input } from '@/components/ui/input'
import { z } from 'zod'

const expensesSearchSchema = z.object({
  category: z.string().optional(),
})

export const Route = createFileRoute('/budgets/$id/expenses')({
  beforeLoad: () => requireAuth(),
  validateSearch: expensesSearchSchema,
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
  const navigate = Route.useNavigate()
  const searchParams = Route.useSearch()
  const { data: budget } = useSuspenseQuery(getBudgetExpensesQueryOptions(id))
  const [filterValue, setFilterValue] = useState(searchParams.category ?? '')

  const filteredExpenses = budget.expenses.filter((expense) => {
    if (!filterValue.trim()) return true
    const searchTerm = filterValue.toLowerCase()
    return (
      expense.category.label.toLowerCase().includes(searchTerm) ||
      expense.description.toLowerCase().includes(searchTerm)
    )
  })

  const handleFilterChange = (value: string) => {
    setFilterValue(value)
    if (!value.trim()) {
      navigate({
        to: '/budgets/$id/expenses',
        params: { id },
        search: {},
      })
    }
  }

  return (
    <AllExpenses
      budgetName={budget.name}
      linkProvider={({ children }) => (
        <Link to="/budgets/$id" params={{ id: budget.id }}>
          {children}
        </Link>
      )}
    >
      <Input
        type="text"
        placeholder="Search Expense"
        value={filterValue}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="w-full"
      />
      {filteredExpenses.length === 0 && (
        <div className="text-muted-foreground p-8 text-center text-sm">
          {budget.expenses.length === 0
            ? 'No expenses found for this budget'
            : 'No expenses match your filter'}
        </div>
      )}
      {filteredExpenses.length > 0 && (
        <div className="divide-border divide-y">
          {filteredExpenses.map((expense) => (
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
