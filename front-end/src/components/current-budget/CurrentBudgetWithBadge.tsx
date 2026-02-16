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
import { Calendar, ChevronRight } from 'lucide-react'

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
        <LinkProvider>
          <div className="space-y-1.5">
            <CardTitle>
              <h3 className="flex items-center gap-1 hover:underline">
                Current Budget <ChevronRight className="h-4 w-4" />
              </h3>
            </CardTitle>
            <CardDescription>{budgetName}</CardDescription>
          </div>
        </LinkProvider>
        <CardAction>
          <IconBadge.Root active={daysLeft === 0}>
            {daysLeft !== 0 && (
              <IconBadge.Icon>
                <Calendar className="text-secondary h-3.5 w-3.5" />
              </IconBadge.Icon>
            )}
            <span
              className={
                daysLeft === 0
                  ? 'font-grotesk text-destructive-foreground text-xs'
                  : 'text-secondary text-xs font-medium'
              }
            >
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
