import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

type RootProps = {
  children: ReactNode
  className?: string
  active?: boolean
}

export function Root({ children, className, active = false }: RootProps) {
  if (active) {
    return (
      <div
        className={cn(
          `animate-budget-end bg-destructive flex items-center gap-1.5
          rounded-full px-3 py-1.5 hover:cursor-pointer`,
          className,
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        `border-border bg-muted flex items-center gap-2 rounded-full border
        px-2.5 py-1.5`,
        className,
      )}
    >
      {children}
    </div>
  )
}

type IconProps = {
  children: ReactNode
  className?: string
}

export function Icon({ children, className }: IconProps) {
  return <div className={cn('h-3.5 w-3.5', className)}>{children}</div>
}
