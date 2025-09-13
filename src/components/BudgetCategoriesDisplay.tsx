import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'

const getCategoryBudgets = async (budgetId: number) => {
  const { getCategoryBudgets } = await import('../server/budgets')
  return getCategoryBudgets({ data: { budgetId } })
}

const getExpensesByBudgetAndCategory = async (budgetId: number) => {
  const { getAllExpenses } = await import('../server/expenses')
  return getAllExpenses({ data: { budgetId } })
}

interface BudgetCategoriesDisplayProps {
  budgetId: number
}

export default function BudgetCategoriesDisplay({ budgetId }: BudgetCategoriesDisplayProps) {
  const { data: categoryBudgets, isLoading: budgetsLoading } = useQuery({
    queryKey: ['categoryBudgets', budgetId],
    queryFn: () => getCategoryBudgets(budgetId),
  })

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses', budgetId],
    queryFn: () => getExpensesByBudgetAndCategory(budgetId),
  })

  if (budgetsLoading || expensesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!categoryBudgets || categoryBudgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No category budgets set for this budget.</p>
        </CardContent>
      </Card>
    )
  }

  // Group expenses by category
  const expensesByCategory = (expenses || []).reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0
    }
    acc[expense.category] += parseFloat(expense.amount)
    return acc
  }, {} as Record<string, number>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryBudgets.map((categoryBudget) => {
            const allocated = parseFloat(categoryBudget.allocatedAmount)
            const spent = expensesByCategory[categoryBudget.category?.key || ''] || 0
            const remaining = allocated - spent
            const percentage = allocated > 0 ? (spent / allocated) * 100 : 0

            let progressColor = 'bg-green-500' // Under budget
            if (percentage >= 100) {
              progressColor = 'bg-red-500' // Over budget
            } else if (percentage >= 80) {
              progressColor = 'bg-yellow-500' // Near limit
            }

            return (
              <div key={categoryBudget.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{categoryBudget.category?.icon || '📝'}</span>
                  <span className="font-medium">{categoryBudget.category?.label}</span>
                </div>

                <div className="relative">
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-2"
                  />
                  <div
                    className={`absolute top-0 left-0 h-2 rounded-full transition-all ${progressColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    R{formatCurrency(spent)} of R{formatCurrency(allocated)}
                  </span>
                  <span className={`font-medium ${percentage >= 100 ? 'text-red-500' :
                      percentage >= 80 ? 'text-yellow-500' :
                        'text-green-500'
                    }`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                {remaining < 0 && (
                  <div className="text-xs text-red-500">
                    Over budget by R{formatCurrency(Math.abs(remaining))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
