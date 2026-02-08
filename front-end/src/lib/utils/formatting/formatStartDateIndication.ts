import type { BudgetFrequency } from '@/lib/utils/budget-dates'
import { getDaysUntilStart } from './getDaysUntilStart'

export function getStartDateIndication(
  frequency: BudgetFrequency,
  startDay: number,
  customDuration?: number,
  fromDate: Date = new Date(),
): string {
  const diffDays = getDaysUntilStart(frequency, startDay, customDuration, fromDate)

  if (diffDays < 0) {
    return 'In progress'
  }

  if (diffDays === 0) {
    return 'Starts today'
  }

  if (diffDays === 1) {
    return 'Starts tomorrow'
  }

  return `Starts in ${diffDays} days`
}
