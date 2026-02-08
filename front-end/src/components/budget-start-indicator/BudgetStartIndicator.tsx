import { Calendar, Clock } from 'lucide-react'
import type { BudgetFrequency } from '@/lib/utils/budget-dates'
import {
  calculateNextBudgetStart,
  calculateBudgetEnd,
} from '@/lib/utils/budget-dates'
import { formatBudgetEndDate } from '@/lib/utils/formatting/formatBudgetEndDate'

interface BudgetStartIndicatorProps {
  frequency: BudgetFrequency
  daysUntilStart: number
  startDay: number
  customDuration?: number
}

export function BudgetStartIndicator({
  frequency,
  daysUntilStart,
  startDay,
  customDuration,
}: BudgetStartIndicatorProps) {
  const isStartingToday = daysUntilStart === 0

  const startDate = calculateNextBudgetStart(
    frequency,
    startDay,
    customDuration,
  )
  const endDate = calculateBudgetEnd(
    startDate,
    frequency,
    startDay,
    customDuration,
  )
  const formattedEndDate = formatBudgetEndDate(endDate, frequency)

  if (frequency === 'custom') {
    return (
      <div
        className="border-primary/30 bg-accent flex items-center gap-3
          rounded-lg border px-4 py-3"
      >
        <div
          className="bg-primary/20 flex h-9 min-w-9 items-center justify-center
            rounded-full"
        >
          <Clock className="text-primary h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-accent-foreground text-sm font-medium">
            Custom Period
          </span>
          <span className="text-primary text-xs">
            Budget starts today and runs for{' '}
            <strong>{customDuration || 0} </strong>
            day{customDuration !== 1 && 's'}
          </span>
          <span className="text-primary text-xs">
            Ending <strong>{formattedEndDate}</strong>
          </span>
        </div>
      </div>
    )
  }

  if (isStartingToday) {
    return (
      <div
        className="border-primary/30 bg-accent flex items-center gap-3
          rounded-lg border px-4 py-3"
      >
        <div
          className="bg-primary/20 flex h-9 w-9 items-center justify-center
            rounded-full"
        >
          <Clock className="text-primary h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-accent-foreground text-sm font-medium">
            Starts today!
          </span>
          <span className="text-primary text-xs">
            Your new budget begins immediately and ends on{' '}
            <strong>{formattedEndDate}</strong>
          </span>
        </div>
      </div>
    )
  }

  if (daysUntilStart < 0) {
    const daysIn = Math.abs(daysUntilStart)
    return (
      <div
        className="border-primary/30 bg-accent flex items-center gap-3
          rounded-lg border px-4 py-3"
      >
        <div
          className="bg-primary/20 flex h-9 min-w-9 items-center justify-center
            rounded-full"
        >
          <Clock className="text-primary h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-accent-foreground text-sm font-medium">
            Budget in progress
          </span>
          <span className="text-primary text-xs">
            <strong>{daysIn}</strong> day{daysIn !== 1 && 's'} into current
            cycle, ends on <strong>{formattedEndDate}</strong>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-blue-200
        bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/40"
    >
      <div
        className="flex min-h-9 min-w-9 items-center justify-center rounded-full
          bg-blue-100 dark:bg-blue-900"
      >
        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Starts in {daysUntilStart} day{daysUntilStart !== 1 && 's'}
        </span>
        <span className="text-xs text-blue-600 dark:text-blue-400">
          New budget ends <strong>{formattedEndDate} </strong>
          with <strong>{daysUntilStart} </strong> extra day
          {daysUntilStart !== 1 && 's'}
        </span>
      </div>
    </div>
  )
}
