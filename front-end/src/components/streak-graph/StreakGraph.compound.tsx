import { cn } from '@/lib/utils/cn'
import type {
  RootProps,
  HeaderProps,
  TitleProps,
  SubtitleProps,
  StatsProps,
  StatProps,
  GraphProps,
  LegendProps,
  StreakCell,
  StreakLevel,
} from './StreakGraph.types'

const LEVELS: StreakLevel[] = [0, 1, 2, 3, 4]

// Theme-aware green scale (mirrors CategoryChart's under-budget greens). Level 0
// is a neutral empty cell that reads in both light and dark themes.
const LEVEL_CLASS: Record<StreakLevel, string> = {
  0: 'bg-muted',
  1: 'bg-emerald-200 dark:bg-emerald-900',
  2: 'bg-emerald-300 dark:bg-emerald-700',
  3: 'bg-emerald-400 dark:bg-emerald-600',
  4: 'bg-emerald-500 dark:bg-emerald-400',
}

export function Root({ children, className }: RootProps) {
  return (
    <section
      className={cn(
        `bg-card text-card-foreground flex flex-col gap-4 rounded-xl border
        p-4`,
        className,
      )}
    >
      {children}
    </section>
  )
}

export function Header({ children, className }: HeaderProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>{children}</div>
  )
}

export function Title({ children, className }: TitleProps) {
  return (
    <h2
      className={cn(
        'font-grotesk text-foreground text-base font-semibold',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function Subtitle({ children, className }: SubtitleProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)}>{children}</p>
  )
}

export function Stats({ children, className }: StatsProps) {
  return <div className={cn('flex gap-2', className)}>{children}</div>
}

export function Stat({ label, value, className }: StatProps) {
  return (
    <div
      className={cn(
        'bg-muted/40 flex flex-1 flex-col items-center rounded-lg px-3 py-2',
        className,
      )}
    >
      <span className="text-foreground text-xl font-semibold">{value}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  )
}

function cellLabel(cell: StreakCell): string {
  if (cell.count === 0) return `No activity on ${cell.date}`
  const noun = cell.count === 1 ? 'open' : 'opens'
  return `${cell.count} ${noun} on ${cell.date}`
}

function Cell({ cell }: { cell: StreakCell }) {
  if (!cell.inRange) {
    return <div className="h-3 w-3 rounded-sm" aria-hidden="true" />
  }
  const label = cellLabel(cell)
  return (
    <div
      className={cn('h-3 w-3 rounded-sm', LEVEL_CLASS[cell.level])}
      title={label}
      role="img"
      aria-label={label}
    />
  )
}

export function Graph({ weeks, className }: GraphProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="flex w-max gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.days.map((cell) => (
              <Cell key={cell.date} cell={cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Legend({ className }: LegendProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex items-center gap-2 text-xs',
        className,
      )}
    >
      <span>Less</span>
      <div className="flex gap-1">
        {LEVELS.map((level) => (
          <div
            key={level}
            className={cn('h-3 w-3 rounded-sm', LEVEL_CLASS[level])}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  )
}
