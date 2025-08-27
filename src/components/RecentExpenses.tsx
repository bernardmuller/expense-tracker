import { Link } from '@tanstack/react-router'
import type { ExpenseCategory } from '../db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentExpenses, useAllCategories } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils'
import { getCategoryInfo } from '@/lib/category-utils'

interface RecentExpensesProps {
  budgetId: number
}

export default function RecentExpenses({ budgetId }: RecentExpensesProps) {
  const { data: expenses, isLoading, error } = useRecentExpenses({ budgetId })
  const { data: allCategories } = useAllCategories()

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
            {[1, 2, 3].map((i) => (
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
      <Card className="mb-6 border-destructive/50">
        <CardContent className="p-6 bg-destructive/5">
          <p className="text-destructive">Error loading recent expenses</p>
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
          <div className="space-y-1">
            {expenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category, allCategories)
              const amount = parseFloat(expense.amount)

              return (
                <div key={expense.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-lg">
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                    </div>
                  </div>
                  <div className="font-semibold">
                    R{formatCurrency(amount)}
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
