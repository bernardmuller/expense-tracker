import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface BudgetInfoBlockProps {
  currentAmount: number
  previousStartAmount: number
  suggestedStartAmount: number
  budgetName: string
}

export default function BudgetInfoBlock({
  currentAmount,
  previousStartAmount,
  suggestedStartAmount,
  budgetName,
}: BudgetInfoBlockProps) {
  return (
    <Card className="w-full bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Budget Transition</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          You're closing "{budgetName}" and starting a new budget
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-background p-3">
            <span className="text-sm text-muted-foreground">
              Current Balance
            </span>
            <span className="font-semibold">
              {formatCurrency(currentAmount, 'za')}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-background p-3">
            <span className="text-sm text-muted-foreground">
              Previous Budget Start
            </span>
            <span className="font-semibold">
              {formatCurrency(previousStartAmount, 'za')}
            </span>
          </div>
          <div className="flex items-center justify-center py-2">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
            <span className="text-sm font-medium">Suggested Start Amount</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(suggestedStartAmount, 'za')}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          The suggested amount combines your remaining balance with your previous
          budget's starting amount. You can adjust this as needed.
        </p>
      </CardContent>
    </Card>
  )
}
