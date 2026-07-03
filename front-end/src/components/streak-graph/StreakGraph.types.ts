import type { ReactNode } from 'react'

export type StreakLevel = 0 | 1 | 2 | 3 | 4

export type StreakCell = {
  date: string
  count: number
  level: StreakLevel
  /** False for grid-padding days outside the requested window. */
  inRange: boolean
}

export type StreakWeek = {
  days: StreakCell[]
}

export type RootProps = { children: ReactNode; className?: string }
export type HeaderProps = { children: ReactNode; className?: string }
export type TitleProps = { children: ReactNode; className?: string }
export type SubtitleProps = { children: ReactNode; className?: string }
export type StatsProps = { children: ReactNode; className?: string }
export type StatProps = { label: string; value: ReactNode; className?: string }
export type GraphProps = { weeks: StreakWeek[]; className?: string }
export type LegendProps = { className?: string }
