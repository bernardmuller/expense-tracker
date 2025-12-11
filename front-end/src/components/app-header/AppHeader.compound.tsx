import { cn } from '@/lib/utils/cn'
import type {
  RootProps,
  ContentProps,
  IconProps,
  InfoProps,
  ActionProps,
} from './AppHeader.types'

export function Root({ children, className }: RootProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {children}
    </div>
  )
}

export function Content({ children, className }: ContentProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>{children}</div>
  )
}

export function Icon({ src, alt, className }: IconProps) {
  return (
    <div
      className={cn(
        `bg-background flex h-12 w-12 items-center justify-center rounded-full
        border`,
        className,
      )}
    >
      <img src={src} alt={alt} className="h-8 w-8" />
    </div>
  )
}

export function Info({ appName, message, className }: InfoProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="text-sm font-semibold">{appName}</span>
      <span className="text-muted-foreground text-xs">{message}</span>
    </div>
  )
}

export function Action({ children, className }: ActionProps) {
  return <div className={className}>{children}</div>
}
