import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useActiveBudget } from '@/lib/hooks'

interface BudgetDisplayProps {
  userId: string
}

export default function BudgetDisplay({ userId }: BudgetDisplayProps) {
  const { data: budget, isLoading, error } = useActiveBudget({ userId })

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/6" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-6 border-red-200 dark:border-red-800">
        <CardContent className="p-6 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">Error loading budget information</p>
        </CardContent>
      </Card>
    )
  }

  if (!budget) {
    return (
      <Card className="mb-6 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-6 bg-yellow-50 dark:bg-yellow-900/20">
          <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-400 mb-2">No Budget Found</h2>
          <p className="text-yellow-700 dark:text-yellow-300">Create your first budget to start tracking expenses!</p>
        </CardContent>
      </Card>
    )
  }

  const startAmount = parseFloat(budget.startAmount)
  const currentAmount = parseFloat(budget.currentAmount)
  const spentAmount = startAmount - currentAmount
  const spentPercentage = startAmount > 0 ? (spentAmount / startAmount) * 100 : 0

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Monthly Budget</CardTitle>
        <p className="text-sm text-muted-foreground">{budget.name}</p>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            R{currentAmount.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            remaining of ${startAmount.toFixed(2)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent: R{spentAmount.toFixed(2)}</span>
            <span className="text-muted-foreground">{spentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                spentPercentage > 90 ? 'bg-red-500 dark:bg-red-400' :
                spentPercentage > 75 ? 'bg-yellow-500 dark:bg-yellow-400' :
                  'bg-green-500 dark:bg-green-400'
                }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}