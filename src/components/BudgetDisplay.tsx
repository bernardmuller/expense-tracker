import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useActiveBudget } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils'

interface BudgetDisplayProps {
  userId: string
}

export default function BudgetDisplay({ userId }: BudgetDisplayProps) {
  const { data: budget, isLoading, error } = useActiveBudget({ userId })
  const [isAmountVisible, setIsAmountVisible] = useState(false)

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
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Current Budget</CardTitle>
            <p className="text-muted-foreground text-sm">{budget.name}</p>
          </div>
          <Button variant="link" asChild className="text-sm p-0 h-auto">
            <Link to="/budget/$budgetId" params={{ budgetId: budget.id.toString() }}>
              View
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative text-center py-3 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAmountVisible(!isAmountVisible)}
          >
            <div className=" flex justify-center">
              <div className="text-4xl w-full font-bold text-primary">
                {isAmountVisible ? `R${formatCurrency(currentAmount)}` : 'R********'}

              </div>
            </div>
          </Button>
          <div className="text-sm text-muted-foreground">
            remaining of {isAmountVisible ? `R${formatCurrency(startAmount)}` : 'R********'}
          </div>


        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent: R{isAmountVisible ? formatCurrency(spentAmount) : "*******"}</span>
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
