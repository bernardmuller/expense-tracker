import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function Root({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div
      className="bg-muted/40 hover:bg-muted/60 flex cursor-pointer flex-col
        gap-1 rounded-lg p-3"
      onClick={onClick}
    >
      {children}
    </div>
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
        <h3 className="text-foreground font-grotesk text-md font-semibold">
          {name}
        </h3>
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
  return <Progress variant="default" value={percentage} className="h-1" />
}

export function DisabledProgressBar() {
  return <Progress variant="disabled" className="h-1" />
}

export function OverBudgetProgressBar() {
  return <Progress variant="destructive" className="h-1" />
}

export function Stats({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function Planned({ amount }: { amount: string }) {
  return (
    <div className="text-muted-foreground flex items-end gap-1">
      <span>Planned:</span>
      <span className="-mb-1 text-lg">{amount}</span>
    </div>
  )
}

export function Spent({ amount }: { amount: string }) {
  return (
    <div className="text-muted-foreground flex items-end gap-1 text-sm">
      <span>Spent:</span>
      <span className="text-primary font-grotesk -mb-1 text-lg tracking-wider">
        {amount}
      </span>
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
