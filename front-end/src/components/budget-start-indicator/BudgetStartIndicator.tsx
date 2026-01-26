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
        className="flex items-center gap-3 rounded-lg border border-emerald-200
          bg-emerald-50 px-4 py-3"
      >
        <div
          className="flex h-9 min-w-9 items-center justify-center rounded-full
            bg-emerald-100"
        >
          <Clock className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-emerald-700">
            Custom Period
          </span>
          <span className="text-xs text-emerald-600">
            Budget starts today and runs for{' '}
            <strong>{customDuration || 0} </strong>
            day{customDuration !== 1 && 's'}
          </span>
          <span className="text-xs text-emerald-600">
            Ending <strong>{formattedEndDate}</strong>
          </span>
        </div>
      </div>
    )
  }

  if (isStartingToday) {
    return (
      <div
        className="flex items-center gap-3 rounded-lg border border-emerald-200
          bg-emerald-50 px-4 py-3"
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full
            bg-emerald-100"
        >
          <Clock className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-emerald-700">
            Starts today!
          </span>
          <span className="text-xs text-emerald-600">
            Your new budget begins immediately and ends on{' '}
            <strong>{formattedEndDate}</strong>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-blue-200
        bg-blue-50 px-4 py-3"
    >
      <div
        className="flex min-h-9 min-w-9 items-center justify-center rounded-full
          bg-blue-100"
      >
        <Calendar className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-blue-700">
          Starts today with extra days
        </span>
        <span className="text-xs text-blue-600">
          New budget ends <strong>{formattedEndDate} </strong>
          with <strong>{daysUntilStart} </strong> extra day
          {daysUntilStart !== 1 && 's'}
        </span>
      </div>
    </div>
  )
}
