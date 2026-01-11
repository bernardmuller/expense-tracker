import { cn } from '@/lib/utils/cn'
import type { ComponentProps, ReactNode } from 'react'
import type { Label } from '../ui/label'

type RootProps = ComponentProps<typeof Label> & {
  children: ReactNode
}

export function Root({ children, className, ...props }: RootProps) {
  return (
    <label className={cn('w-full cursor-pointer', className)} {...props}>
      {children}
    </label>
  )
}

type ContentProps = {
  children: ReactNode
  className?: string
}

export function Content({ children, className }: ContentProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>{children}</div>
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
      <span className="text-xl">{icon}</span>
      <span className="text-md font-semibold">{name}</span>
    </div>
  )
}
