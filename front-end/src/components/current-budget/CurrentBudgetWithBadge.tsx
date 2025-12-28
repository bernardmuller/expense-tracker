import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { CurrentBudgetProps } from './CurrentBudget.types'
import { CurrentBudgetContent } from './CurrentBudget'
import * as IconBadge from '@/components/icon-badge/IconBadge.compound'
import { Calendar } from 'lucide-react'

export default function CurrentBudgetWithBadge({
  budgetName,
  currentAmount,
  startingAmount,
  spentAmount,
  spentPercentage,
  daysLeft = 0,
  linkProvider: LinkProvider,
  onClick,
}: CurrentBudgetProps & { daysLeft: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Budget</CardTitle>
        <Button variant="link" asChild className="w-fit p-0">
          <LinkProvider>
            <CardDescription>{budgetName}</CardDescription>
          </LinkProvider>
        </Button>
        <CardAction>
          <IconBadge.Root active={daysLeft <= 0}>
            <IconBadge.Icon>
              <Calendar className="text-primary h-3.5 w-3.5" />
            </IconBadge.Icon>
            <span className="text-primary text-xs font-medium">
              {daysLeft === 0 ? (
                <LinkProvider>Budget End</LinkProvider>
              ) : daysLeft < 0 ? (
                daysLeft === -1 ? (
                  <LinkProvider>Ended Yesterday</LinkProvider>
                ) : (
                  <LinkProvider>{Math.abs(daysLeft)} days past</LinkProvider>
                )
              ) : daysLeft === 1 ? (
                `Ends Tomorrow`
              ) : (
                `${daysLeft} days left`
              )}
            </span>
          </IconBadge.Root>
        </CardAction>
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
