import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { CurrentBudgetProps } from './CurrentBudget.types'
import { Progress } from '../ui/progress'

export function CurrentBudget({
  budgetName,
  currentAmount,
  startingAmount,
  spentAmount,
  spentPercentage,
  onClick,
  linkProvider: LinkProvider,
}: CurrentBudgetProps) {
  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>Current Budget</CardTitle>
          <p className="text-muted-foreground text-sm">{budgetName}</p>
        </div>
        <Button variant="link" className="text-sm" asChild>
          <LinkProvider>View</LinkProvider>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Button variant="ghost" onClick={onClick}>
          <span className="text-primary pb-1 text-4xl font-bold">
            {currentAmount}
          </span>
        </Button>
        <span className="text-muted-foreground text-sm">
          remaining of {startingAmount}
        </span>
      </CardContent>
      <CardFooter className="flex flex-col gap-1">
        <div className="flex w-full justify-between">
          <span className="text-muted-foreground">{spentAmount}</span>
          <span className="text-muted-foreground">%{spentPercentage}</span>
        </div>
        <Progress value={spentPercentage} />
      </CardFooter>
    </Card>
  )
}
