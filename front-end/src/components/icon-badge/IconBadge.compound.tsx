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
          `from-primary via-primary/60 to-primary animate-pulse rounded-full
          bg-gradient-to-r p-[1px] [animation-duration:3s]`,
          className,
        )}
      >
        <div
          className="bg-card flex items-center gap-2 rounded-full px-2.5 py-1.5"
        >
          {children}
        </div>
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
