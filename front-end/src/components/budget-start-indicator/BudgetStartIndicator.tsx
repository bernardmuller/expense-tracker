import { Calendar, Clock } from 'lucide-react'

interface BudgetStartIndicatorProps {
  daysUntilStart: number
}

export function BudgetStartIndicator({
  daysUntilStart,
}: BudgetStartIndicatorProps) {
  const isStartingSoon = daysUntilStart <= 3
  const isStartingToday = daysUntilStart === 0

  if (isStartingToday) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
          <Clock className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-emerald-700">
            Starts today!
          </span>
          <span className="text-xs text-emerald-600">
            Your new budget begins immediately
          </span>
        </div>
      </div>
    )
  }

  if (isStartingSoon) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
          <Clock className="h-4 w-4 text-amber-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-amber-700">
            Starts in {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
          </span>
          <span className="text-xs text-amber-600">
            Your new budget will begin soon
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
        <Calendar className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-blue-700">
          Starts in {daysUntilStart} days
        </span>
        <span className="text-xs text-blue-600">
          Plan ahead for your new budget
        </span>
      </div>
    </div>
  )
}
