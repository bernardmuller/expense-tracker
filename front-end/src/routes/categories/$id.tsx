import { requireAuth } from '@/lib/auth/route-guard'
import {
  getCategoryExpensesTimeseriesQueryOptions,
  transformTimeseriesData,
} from '@/lib/http/queries/categories/getCategoryExpensesTimeseries'
import { getCategoryExpensesQueryOptions } from '@/lib/http/queries/categories/getCategoryExpenses'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { CategoryDetailSkeleton } from './categories.skeleton'
import { AppHeader } from '@/components/app-header'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Layout } from '@/components/layouts/Layout'
import CategoryChart from '@/components/category-chart/CategoryChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import RecentExpense from '@/components/recent-expenses/RecentExpense'
import { format } from 'date-fns'

export const Route = createFileRoute('/categories/$id')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        getCategoryExpensesTimeseriesQueryOptions(params.id, 6),
      ),
      context.queryClient.ensureQueryData(
        getCategoryExpensesQueryOptions(params.id),
      ),
    ])
  },
  component: CategoryDetailPage,
})

function CategoryDetailPage() {
  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryDetail />
    </Suspense>
  )
}

function CategoryDetail() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [filterValue, setFilterValue] = useState('')

  const { data: timeseriesData } = useSuspenseQuery(
    getCategoryExpensesTimeseriesQueryOptions(id, 6),
  )
  const { data: expensesData } = useSuspenseQuery(
    getCategoryExpensesQueryOptions(id),
  )

  const category = expensesData.expenses[0]?.category
  const categoryName = category?.label || 'Category'
  const categoryIcon = category?.icon || '📊'

  const chartData = transformTimeseriesData(timeseriesData)

  const filteredExpenses = expensesData.expenses.filter((expense) => {
    if (!filterValue.trim()) return true
    const searchTerm = filterValue.toLowerCase()
    return expense.description.toLowerCase().includes(searchTerm)
  })

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0,
  )

  return (
    <>
      <AppHeader.Root>
        <AppHeader.Left>
          <AppHeader.Back onBack={() => navigate({ to: '/dashboard' })} />
        </AppHeader.Left>
        <AppHeader.Center>
          <AppHeader.Title>Category</AppHeader.Title>
        </AppHeader.Center>
        <AppHeader.Right>
          <ThemeToggle />
        </AppHeader.Right>
      </AppHeader.Root>
      <Layout>
        <CategoryChart
          data={chartData.reverse()}
          categoryName={`${categoryIcon} ${categoryName}`}
          currency="R"
        />

        <Card>
          <CardHeader>
            <CardTitle>
              {expensesData.count} Expense
              {expensesData.count !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search expenses..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="mb-4 w-full"
            />

            {filteredExpenses.length === 0 && (
              <div className="text-muted-foreground p-8 text-center text-sm">
                {expensesData.expenses.length === 0
                  ? 'No expenses found for this category'
                  : 'No expenses match your search'}
              </div>
            )}

            {filteredExpenses.length > 0 && (
              <>
                <div className="flex flex-col gap-1 py-2">
                  {filteredExpenses.map((expense) => (
                    <RecentExpense
                      key={expense.id}
                      amount={formatCurrency(parseFloat(expense.amount), 'za')}
                      description={expense.description}
                      emoji={expense.category.icon}
                      categoryLabel={expense.category.label}
                      createdAt={format(expense.createdAt, 'dd MMMM yyyy')}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-muted-foreground font-medium">
                    Total
                  </span>
                  <span className="text-foreground font-semibold">
                    {formatCurrency(totalAmount, 'za')}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </Layout>
    </>
  )
}
