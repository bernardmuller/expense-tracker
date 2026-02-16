import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type {
  CurrentBudgetProps,
  CurrentBudgetBaseProps,
} from './CurrentBudget.types'
import { Progress } from '../ui/progress'
import { formatPercentage } from '@/lib/utils/formatting/formatPercentage'

export function CurrentBudgetContent({
  budgetName,
  currentAmount,
  startingAmount,
  spentAmount,
  spentPercentage,
  onClick,
}: CurrentBudgetBaseProps) {
  return (
    <>
      <CardContent className="flex flex-col items-center">
        <Button variant="ghost" onClick={onClick}>
          <span
            className="text-primary font-grotesk pb-1 text-4xl font-semibold"
          >
            {currentAmount}
          </span>
        </Button>
        <span className="text-muted-foreground text-sm">
          remaining of {startingAmount}
        </span>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <span className="text-muted-foreground text-sm font-light">
            Spent: {spentAmount}
          </span>
          <span className="text-sm">{formatPercentage(spentPercentage)}</span>
        </div>
        <Progress value={spentPercentage} />
      </CardFooter>
    </>
  )
}

export function CurrentBudget({
  budgetName,
  currentAmount,
  startingAmount,
  spentAmount,
  spentPercentage,
  linkProvider: LinkProvider,
  onClick,
}: CurrentBudgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Budget</CardTitle>
        <CardDescription>{budgetName}</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <LinkProvider>
              <span className="text-primary">View</span>
            </LinkProvider>
          </Button>
        </CardAction>
      </CardHeader>
      <CurrentBudgetContent
        budgetName={budgetName}
        currentAmount={currentAmount.toString()}
        startingAmount={startingAmount.toString()}
        spentAmount={spentAmount.toString()}
        spentPercentage={spentPercentage}
        onClick={onClick}
      />
    </Card>
  )
}

export function CurrentBudgetWithoutAction({
  budgetName,
  currentAmount,
  startingAmount,
  spentAmount,
  spentPercentage,
  onClick,
}: CurrentBudgetBaseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Detail</CardTitle>
        <CardDescription>{budgetName}</CardDescription>
      </CardHeader>
      <CurrentBudgetContent
        budgetName={budgetName}
        currentAmount={currentAmount}
        startingAmount={startingAmount}
        spentAmount={spentAmount}
        spentPercentage={spentPercentage}
        onClick={onClick}
      />
    </Card>
  )
}

export { default as CurrentBudgetWithBadge } from './CurrentBudgetWithBadge'
