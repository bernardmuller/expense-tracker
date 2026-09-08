import { cn } from '@/lib/utils/cn'
import type {
  RootProps,
  TitleProps,
  ValueProps,
  SubtextProps,
} from './KpiCard.types'
import { Card, CardContent } from '../ui/card'

export function Root({ children, className }: RootProps) {
  return (
    <Card>
      <CardContent className="space-y-1">{children}</CardContent>
    </Card>
  )
}

export function Title({ children, className }: TitleProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground text-sm tracking-[0.14em] uppercase',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PositiveValue({ children, className }: ValueProps) {
  return (
    <div
      className={cn(
        'font-grotesk text-primary text-3xl font-medium',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function NegativeValue({ children, className }: ValueProps) {
  return (
    <div
      className={cn(
        'font-grotesk text-destructive text-3xl font-medium',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Subtext({ children, className }: SubtextProps) {
  return (
    <div className={cn('text-muted-foreground/70 text-sm', className)}>
      {children}
    </div>
  )
}
