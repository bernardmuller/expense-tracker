import type { BudgetFrequency } from '@/lib/utils/budget-dates'
import { calculateNextBudgetStart } from '@/lib/utils/budget-dates'

export function getDaysUntilStart(
  frequency: BudgetFrequency,
  startDay: number,
  customDuration?: number,
  fromDate: Date = new Date(),
): number {
  const today = new Date(fromDate)
  today.setHours(0, 0, 0, 0)

  const startDate = calculateNextBudgetStart(
    frequency,
    startDay,
    fromDate,
  )
  startDate.setHours(0, 0, 0, 0)

  const diffTime = startDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
