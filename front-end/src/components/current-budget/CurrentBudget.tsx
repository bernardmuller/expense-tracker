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
import type { CurrentBudgetProps, CurrentBudgetBaseProps } from './CurrentBudget.types'
import { Progress } from '../ui/progress'
import { formatPercentage } from '@/lib/utils/formatting/formatPercentage'
import { usePrivacy } from '@/lib/hooks/usePrivacy'

const MASKED_VALUE = '********'

function CurrentBudgetContent({
  budgetName,
  currentAmount,
  startingAmount,
  spentAmount,
  spentPercentage,
}: CurrentBudgetBaseProps) {
  const { isPrivacyEnabled, togglePrivacy } = usePrivacy()

  const displayValue = (value: string) => {
    return isPrivacyEnabled ? MASKED_VALUE : value
  }

  const handleClick = () => {
    togglePrivacy()
  }

  return (
    <>
      <CardContent className="flex flex-col items-center">
        <Button variant="ghost" onClick={handleClick}>
          <span className="text-primary pb-1 text-4xl font-bold">
            {displayValue(currentAmount)}
          </span>
        </Button>
        <span className="text-muted-foreground text-sm">
          remaining of {displayValue(startingAmount)}
        </span>
      </CardContent>
      <CardFooter className="flex flex-col gap-1">
        <div className="flex w-full justify-between">
          <span className="text-muted-foreground">
            Spent: {displayValue(spentAmount)}
          </span>
          <span className="text-muted-foreground">
            {formatPercentage(spentPercentage)}
          </span>
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
        currentAmount={currentAmount}
        startingAmount={startingAmount}
        spentAmount={spentAmount}
        spentPercentage={spentPercentage}
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
}: CurrentBudgetBaseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Budget</CardTitle>
        <CardDescription>{budgetName}</CardDescription>
      </CardHeader>
      <CurrentBudgetContent
        budgetName={budgetName}
        currentAmount={currentAmount}
        startingAmount={startingAmount}
        spentAmount={spentAmount}
        spentPercentage={spentPercentage}
      />
    </Card>
  )
}
