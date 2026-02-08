import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface NavigationLinkProps {
  icon: React.ReactNode
  iconClassName?: string
  title: string
  subtitle: string
  linkProvider: ({ children }: { children: React.ReactNode }) => React.ReactNode
  variant?: 'link' | 'primary'
}

export function NavigationLink({
  icon,
  iconClassName,
  title,
  subtitle,
  linkProvider: LinkProvider,
  variant = 'link',
}: NavigationLinkProps) {
  return (
    <LinkProvider>
      <div
        className={cn(
          `bg-muted/40 hover:bg-muted/60 flex cursor-pointer items-center gap-3
          rounded-lg p-3 px-6`,
          { 'bg-transparent hover:bg-transparent': variant === 'primary' },
        )}
      >
        <div
          className={`flex items-center justify-center rounded-md p-2
            ${iconClassName ?? 'bg-primary'}`}
        >
          {icon}
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-foreground font-grotesk font-semibold">
            {title}
          </span>
          <span className="text-muted-foreground text-sm">{subtitle}</span>
        </div>
        <div
          className={cn({
            [`hover:bg-muted/60 flex aspect-square h-11 w-11 items-center
            justify-center rounded-lg`]: variant === 'primary',
          })}
        >
          <ChevronRight className="text-muted-foreground h-5 w-5" />
        </div>
      </div>
    </LinkProvider>
  )
}
