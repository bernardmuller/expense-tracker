import { cn } from '@/lib/utils/cn'
import type {
  RootProps,
  ContentProps,
  IconProps,
  InfoProps,
  ActionProps,
  BackProps,
  LeftProps,
  CenterProps,
  RightProps,
  TitleProps,
  NavigationControlsProps,
} from './AppHeader.types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Root({ children, className }: RootProps) {
  return (
    <header className="bg-background fixed z-50 w-screen">
      <div
        className={cn(
          `mx-auto grid w-screen grid-cols-3 items-center self-center p-4
          shadow-md lg:w-1/2`,
          className,
        )}
      >
        {children}
      </div>
    </header>
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
        `-m-3 flex h-18 min-h-18 w-18 min-w-18 items-center justify-center
        overflow-hidden rounded-lg`,
        className,
      )}
    >
      <img src={src} alt={alt} className="h-full w-full" />
    </div>
  )
}

export function Info({ appName, message, className }: InfoProps) {
  return (
    <div className={cn('flex flex-col px-3', className)}>
      <span className="text-md font-grotesk font-semibold">{appName}</span>
      <span className="text-muted-foreground text-sm text-nowrap">
        {message}
      </span>
    </div>
  )
}

export function Action({ children, className }: ActionProps) {
  return <div className={className}>{children}</div>
}

export function Back({ onBack, label = 'Back', className }: BackProps) {
  return (
    <button
      onClick={onBack}
      className={cn(
        `text-muted-foreground hover:text-foreground flex items-center gap-1
        transition-colors`,
        className,
      )}
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

export function Left({ children, className }: LeftProps) {
  return <div className={cn('flex items-center', className)}>{children}</div>
}

export function Center({ children, className }: CenterProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {children}
    </div>
  )
}

export function Right({ children, className }: RightProps) {
  return (
    <div className={cn('flex items-center justify-end gap-1', className)}>
      {children}
    </div>
  )
}

export function Title({ children, className }: TitleProps) {
  return (
    <h1
      className={cn(
        'font-grotesk text-foreground text-center text-base font-semibold',
        className,
      )}
    >
      {children}
    </h1>
  )
}

export function NavigationControls({
  title,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  className,
}: NavigationControlsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous budget</span>
      </Button>
      <h1 className="font-grotesk text-foreground text-base font-semibold">
        {title}
      </h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!hasNext}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next budget</span>
      </Button>
    </div>
  )
}
