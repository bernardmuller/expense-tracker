import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getRecentExpenses } from '../server/expenses'
import { queryKeys } from '../lib/query-client'
import { ExpenseCategory } from '../db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface RecentExpensesProps {
  budgetId: string
}

const categoryIcons: Record<ExpenseCategory, string> = {
  food: '🍽️',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎮',
  utilities: '🏠',
  other: '💰',
}

const categoryLabels: Record<ExpenseCategory, string> = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  utilities: 'Utilities',
  other: 'Other',
}

export default function RecentExpenses({ budgetId }: RecentExpensesProps) {
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: queryKeys.recentExpenses(budgetId),
    queryFn: () => getRecentExpenses({ data: { budgetId } }),
    enabled: !!budgetId,
  })

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-6 border-red-200 dark:border-red-800">
        <CardContent className="p-6 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">Error loading recent expenses</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Expenses</CardTitle>
          <Button variant="link" asChild className="text-sm p-0 h-auto">
            <Link to="/expenses">
              Show All
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>

        {!expenses || expenses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-muted-foreground">No expenses yet</p>
            <p className="text-sm text-muted-foreground">Add your first expense below!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const category = expense.category as ExpenseCategory
              const icon = categoryIcons[category] || categoryIcons.other
              const label = categoryLabels[category] || 'Other'
              const amount = parseFloat(expense.amount)
              
              return (
                <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full text-lg">
                      {icon}
                    </div>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-xs text-muted-foreground capitalize">{label}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-red-600 dark:text-red-400">
                    -${amount.toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}