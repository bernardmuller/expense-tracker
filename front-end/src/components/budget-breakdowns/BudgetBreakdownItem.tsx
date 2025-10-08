import { Link } from '@tanstack/react-router'
import type { NavigateOptions } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function BudgetBreakdownItem({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Card
      data-testid="budgetBreakdownItem"
      className="border-border/50 cursor-pointer p-4"
    >
      {children}
    </Card>
  )
}

BudgetBreakdownItem.Link = function LinkProvider({
  children,
  url,
  params,
  searchParams,
}: {
  children: React.ReactNode
  url: NavigateOptions['to']
  params?: NavigateOptions['params']
  searchParams?: NavigateOptions['search']
}) {
  return (
    <Link to={url} params={params} search={searchParams}>
      {children}
    </Link>
  )
}

BudgetBreakdownItem.Header = function Header({
  name,
  icon,
  children,
}: {
  name: string
  icon: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-testid="headerRootDivider"
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-foreground text-lg font-semibold">{name}</h3>
      </div>
      {children}
    </div>
  )
}

BudgetBreakdownItem.OverBudget = function OverBudget() {
  return (
    <Badge data-testid="overBudgetBadge" variant="destructive">
      Over budget
    </Badge>
  )
}

BudgetBreakdownItem.Unplanned = function Unplanned() {
  return (
    <Badge data-testid="unplannedBudgetBadge" variant="outline">
      Unplanned
    </Badge>
  )
}

BudgetBreakdownItem.Progress = function ProgressBar({
  percentage,
}: {
  percentage: number
}) {
  return <Progress data-testid="progress" value={percentage} className="h-1" />
}

BudgetBreakdownItem.DisabledProgress = function DisabledProgressBar() {
  return (
    <Progress data-testid="progressDisabled" className="bg-primary/10 h-1" />
  )
}

BudgetBreakdownItem.OverBudgetProgress = function OverBudgetProgressBar() {
  return (
    <Progress data-testid="progressOverBudget" className="h-1 bg-red-500/50" />
  )
}

BudgetBreakdownItem.Stats = function Stats({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-testid="statsContainer" className="space-y-2">
      {children}
    </div>
  )
}

BudgetBreakdownItem.Planned = function Planned({ amount }: { amount: string }) {
  return (
    <div className="text-muted-foreground flex gap-1">
      <span>Planned:</span>
      <span>{amount}</span>
    </div>
  )
}

BudgetBreakdownItem.Spent = function Spent({ amount }: { amount: string }) {
  return (
    <div className="text-muted-foreground font-sm flex gap-1">
      <span>Spent:</span>
      <span className="text-primary font-semibold">{amount}</span>
    </div>
  )
}

BudgetBreakdownItem.ReverseRow = function ReverseRow({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-testid="reverseRowContainer" className="flex flex-row-reverse justify-between text-sm">
      {children}
    </div>
  )
}
