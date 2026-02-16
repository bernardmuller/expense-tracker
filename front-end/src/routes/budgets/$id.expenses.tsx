import AllExpenses from '@/components/all-expenses/AllExpenses'
import { AppHeader } from '@/components/app-header'
import RecentExpense from '@/components/recent-expenses/RecentExpense'
import { requireAuth } from '@/lib/auth/route-guard'
import { getBudgetExpensesQueryOptions } from '@/lib/http/queries/budgets/getBudgetExpenses'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { BudgetExpensesSkeleton } from './budgets.expenses.skeleton'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Swiper } from '@/components/swiper'
import { Trash2 } from 'lucide-react'
import { useDeleteExpense } from '@/lib/http/hooks/use-delete-expense'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { Layout } from '@/components/layouts/Layout'

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
  const deleteExpenseMutation = useDeleteExpense()

  const userIdResult = getUserIdFromAccessToken()
  const userId = userIdResult.isOk() ? userIdResult.value : ''

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

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0,
  )

  return (
    <>
      <AppHeader.Root>
        <AppHeader.Left>
          <AppHeader.Back
            onBack={() => navigate({ to: '/budgets/$id', params: { id } })}
          />
        </AppHeader.Left>
        <AppHeader.Center>
          <AppHeader.Title>Expenses</AppHeader.Title>
        </AppHeader.Center>
        <AppHeader.Right>
          <ThemeToggle />
        </AppHeader.Right>
      </AppHeader.Root>
      <Layout>
        <AllExpenses budgetName={budget.name}>
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
            <>
              <div className="flex flex-col gap-1 py-2">
                {filteredExpenses.map((expense) => (
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
                          budgetId: id,
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
              {/* <Separator className="my-4" />*/}
              <div className="flex items-center justify-between py-2 pr-3">
                <span className="text-muted-foreground font-medium">Total</span>
                <span className="text-foreground font-semibold">
                  {formatCurrency(totalAmount, 'za')}
                </span>
              </div>
            </>
          )}
        </AllExpenses>
      </Layout>
    </>
  )
}
