import type { BudgetFrequency } from '@/lib/utils/budget-dates'

function getOrdinalDay(day: number): string {
  const j = day % 10
  const k = day % 100
  if (j === 1 && k !== 11) return `${day}st`
  if (j === 2 && k !== 12) return `${day}nd`
  if (j === 3 && k !== 13) return `${day}rd`
  return `${day}th`
}

function getDayOfWeekName(date: Date): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return days[date.getDay()]
}

function getMonthName(date: Date): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return months[date.getMonth()]
}

export function formatBudgetEndDate(
  date: Date,
  frequency: BudgetFrequency,
): string {
  const dayOfWeek = getDayOfWeekName(date)
  const month = getMonthName(date)
  const day = getOrdinalDay(date.getDate())

  if (frequency === 'weekly' || frequency === 'bi-weekly') {
    return `${dayOfWeek}, ${month} ${day}`
  }

  return `${month} ${day}`
}
