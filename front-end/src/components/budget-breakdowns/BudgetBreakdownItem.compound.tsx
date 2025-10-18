import { Link } from '@tanstack/react-router'
import type { NavigateOptions } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function Root({ children }: { children: React.ReactNode }) {
  return <Card className="border-border/50 cursor-pointer p-4">{children}</Card>
}

export function LinkTrigger({
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

export function Header({
  name,
  icon,
  children,
}: {
  name: string
  icon: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-foreground text-lg font-semibold">{name}</h3>
      </div>
      {children}
    </div>
  )
}

export function OverBudgetBadge() {
  return <Badge variant="destructive">Over budget</Badge>
}

export function UnplannedBadge() {
  return <Badge variant="outline">Unplanned</Badge>
}

export function ProgressBar({ percentage }: { percentage: number }) {
  return <Progress value={percentage} className="h-1" />
}

export function DisabledProgressBar() {
  return <Progress className="bg-primary/10 h-1" />
}

export function OverBudgetProgressBar() {
  return <Progress className="h-1 bg-red-500/50" />
}

export function Stats({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function Planned({ amount }: { amount: string }) {
  return (
    <div className="text-muted-foreground flex gap-1">
      <span>Planned:</span>
      <span>{amount}</span>
    </div>
  )
}

export function Spent({ amount }: { amount: string }) {
  return (
    <div className="text-muted-foreground font-sm flex gap-1">
      <span>Spent:</span>
      <span className="text-primary font-semibold">{amount}</span>
    </div>
  )
}

export function ReverseRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row-reverse justify-between text-sm">
      {children}
    </div>
  )
}
