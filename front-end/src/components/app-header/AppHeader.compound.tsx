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
    <div className={cn('mb-6 flex items-center justify-between', className)}>
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
        `-m-3 flex h-18 w-18 items-center justify-center overflow-hidden
        rounded-lg`,
        className,
      )}
    >
      <img src={src} alt={alt} className="h-full w-full" />
    </div>
  )
}

export function Info({ appName, message, className }: InfoProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="text-md font-grotesk font-semibold">{appName}</span>
      <span className="text-muted-foreground text-sm">{message}</span>
    </div>
  )
}

export function Action({ children, className }: ActionProps) {
  return <div className={className}>{children}</div>
}
