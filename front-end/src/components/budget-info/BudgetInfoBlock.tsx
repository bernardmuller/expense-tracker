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
    <Card className="bg-primary/5 w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Budget Transition</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          You're closing "{budgetName}" and starting a new budget
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div
            className="bg-background flex items-center justify-between
              rounded-lg p-3"
          >
            <span className="text-muted-foreground text-sm">
              Current Balance
            </span>
            <span className="font-semibold">
              {formatCurrency(currentAmount, 'za')}
            </span>
          </div>
          <div
            className="bg-background flex items-center justify-between
              rounded-lg p-3"
          >
            <span className="text-muted-foreground text-sm">
              Previous Budget Start
            </span>
            <span className="font-semibold">
              {formatCurrency(previousStartAmount, 'za')}
            </span>
          </div>
          <div className="flex items-center justify-center py-2">
            <ArrowRight className="text-muted-foreground h-4 w-4" />
          </div>
          <div
            className="bg-primary/10 flex items-center justify-between
              rounded-lg p-3"
          >
            <span className="text-sm font-medium">Suggested Start Amount</span>
            <span className="text-primary text-lg font-bold">
              {formatCurrency(suggestedStartAmount, 'za')}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          The suggested amount combines your remaining balance with your
          previous budget's starting amount. You can adjust this as needed.
        </p>
      </CardContent>
    </Card>
  )
}
