import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useActiveBudget } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils'

interface BudgetDisplayProps {
  userId: string
}

export default function BudgetDisplay({ userId }: BudgetDisplayProps) {
  const { data: budget, isLoading, error } = useActiveBudget({ userId })

  if (isLoading) {
    return (
      <Card>
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
      <Card className="border-destructive/50">
        <CardContent className="p-6 bg-destructive/5">
          <p className="text-destructive">Error loading budget information</p>
        </CardContent>
      </Card>
    )
  }

  if (!budget) {
    return (
      <Card className="border-chart-4/50">
        <CardContent className="p-6 bg-chart-4/5">
          <h2 className="text-lg font-bold text-chart-4 mb-2">No Budget Found</h2>
          <p className="text-chart-4/80">Create your first budget to start tracking expenses!</p>
        </CardContent>
      </Card>
    )
  }

  const startAmount = parseFloat(budget.startAmount)
  const currentAmount = parseFloat(budget.currentAmount)
  const spentAmount = startAmount - currentAmount
  const spentPercentage = startAmount > 0 ? (spentAmount / startAmount) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{budget.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-primary mb-1">
            R{formatCurrency(currentAmount)}
          </div>
          <div className="text-sm text-muted-foreground">
            remaining of R{formatCurrency(startAmount)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent: R{formatCurrency(spentAmount)}</span>
            <span className="text-muted-foreground">{spentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${spentPercentage > 90 ? 'bg-destructive' :
                spentPercentage > 75 ? 'bg-chart-4' :
                  'bg-chart-1'
                }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
