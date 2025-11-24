import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import type { ComponentProps, ReactNode } from 'react'

type RootProps = ComponentProps<typeof Card> & {
  children: ReactNode
}

export function Root({ children, className, ...props }: RootProps) {
  return (
    <label>
      <Card className={cn('cursor-pointer', className)} {...props}>
        {children}
      </Card>
    </label>
  )
}

type ContentProps = {
  children: ReactNode
  className?: string
}

export function Content({ children, className }: ContentProps) {
  return (
    <CardContent>
      <div className={cn('flex items-center gap-3', className)}>{children}</div>
    </CardContent>
  )
}

type IconNameProps = {
  icon: string
  name: string
  className?: string
}

export function IconName({ icon, name, className }: IconNameProps) {
  return (
    <div className={cn('flex flex-1 items-center gap-2', className)}>
      <span className="text-2xl">{icon}</span>
      <span className="text-md font-semibold">{name}</span>
    </div>
  )
}
