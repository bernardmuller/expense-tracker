import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { ActiveBudgetByUserId } from '@/server/queries/budgets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { getVisibleCurrency } from '@/lib/utils/getVisibleCurrency'

interface BudgetDisplayProps {
  budget: ActiveBudgetByUserId;
  currencySymbol: string
  isAmountVisible: boolean
  onAmountVisible: () => void
}

export default function CurrentBudget({
  budget,
  currencySymbol,
  isAmountVisible,
  onAmountVisible,
}: BudgetDisplayProps) {
  const startAmount = parseFloat(budget.startAmount)
  const currentAmount = parseFloat(budget.currentAmount)
  const spentAmount = startAmount - currentAmount
  const spentPercentage = startAmount > 0 ? (spentAmount / startAmount) * 100 : 0
  const displaySpentPercentage = spentPercentage.toFixed(1).concat("%");

  const displayStartAmount = useMemo(() => getVisibleCurrency({
    currency: currencySymbol,
    isVisible: isAmountVisible,
    amount: startAmount
  }), [isAmountVisible])

  const displayCurrentAmount = useMemo(() => getVisibleCurrency({
    currency: currencySymbol,
    isVisible: isAmountVisible,
    amount: currentAmount
  }), [isAmountVisible])

  const displaySpentAmount = useMemo(() => getVisibleCurrency({
    currency: currencySymbol,
    isVisible: isAmountVisible,
    amount: spentAmount
  }), [isAmountVisible])

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
            onClick={() => onAmountVisible()}
          >
            <div className=" flex justify-center">
              <div className="text-4xl w-full font-bold text-primary">
                <span>
                  {displayCurrentAmount}
                </span>
              </div>
            </div>
          </Button>
          <div className="text-sm text-muted-foreground">
            <span>
              remaining of {displayStartAmount}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent: {displaySpentAmount}</span>
            <span className="text-muted-foreground">{displaySpentPercentage}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={cn('h-2 rounded-full transition-all duration-300', {
                'bg-chart-1': spentPercentage <= 75,
                'bg-chart-4': spentPercentage > 75,
                'bg-destructive': spentPercentage > 90,
              })}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}
