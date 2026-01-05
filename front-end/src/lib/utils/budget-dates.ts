export type BudgetFrequency = 'weekly' | 'bi-weekly' | 'monthly' | 'custom'

export function calculateNextBudgetStart(
  frequency: BudgetFrequency,
  startDay: number,
  customDuration?: number,
  fromDate: Date = new Date(),
): Date {
  const today = new Date(fromDate)
  today.setHours(0, 0, 0, 0)

  switch (frequency) {
    case 'monthly': {
      const nextStart = new Date(today)
      nextStart.setDate(startDay)

      if (nextStart <= today) {
        nextStart.setMonth(nextStart.getMonth() + 1)
      }

      if (nextStart.getDate() !== startDay) {
        nextStart.setDate(0)
      }

      return nextStart
    }

    case 'weekly': {
      const nextStart = new Date(today)
      const currentDay = today.getDay()
      const daysUntilStart = (startDay - currentDay + 7) % 7

      if (daysUntilStart === 0) {
        nextStart.setDate(nextStart.getDate() + 7)
      } else {
        nextStart.setDate(nextStart.getDate() + daysUntilStart)
      }

      return nextStart
    }

    case 'bi-weekly': {
      const nextStart = new Date(today)
      const currentDay = today.getDay()
      const daysUntilStart = (startDay - currentDay + 7) % 7

      if (daysUntilStart === 0) {
        nextStart.setDate(nextStart.getDate() + 7)
      } else {
        nextStart.setDate(nextStart.getDate() + daysUntilStart)
      }

      return nextStart
    }

    case 'custom': {
      return today
    }

    default:
      return today
  }
}

export function calculateBudgetEnd(
  startDate: Date,
  frequency: BudgetFrequency,
  startDay: number,
  customDuration?: number,
): Date {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  switch (frequency) {
    case 'monthly': {
      const nextStart = new Date(start)
      nextStart.setMonth(nextStart.getMonth() + 1)

      if (nextStart.getDate() !== startDay) {
        nextStart.setDate(0)
      }

      const end = new Date(nextStart)
      end.setDate(end.getDate() - 1)
      return end
    }

    case 'weekly': {
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return end
    }

    case 'bi-weekly': {
      const end = new Date(start)
      end.setDate(end.getDate() + 13)
      return end
    }

    case 'custom': {
      const end = new Date(start)
      end.setDate(end.getDate() + (customDuration || 30) - 1)
      return end
    }

    default:
      return start
  }
}

export function getDaysRemainingInBudget(endDate: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays + 1)
}

export function getDayOfWeekName(dayNumber: number): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return days[dayNumber] || ''
}

export function getOrdinalDay(day: number): string {
  const j = day % 10
  const k = day % 100
  if (j === 1 && k !== 11) return `${day}st`
  if (j === 2 && k !== 12) return `${day}nd`
  if (j === 3 && k !== 13) return `${day}rd`
  return `${day}th`
}

export function getBudgetCycleDescription(
  frequency: BudgetFrequency,
  startDay: number,
  customDuration?: number,
): string {
  switch (frequency) {
    case 'monthly': {
      const ordinalDay = getOrdinalDay(startDay)
      const endDay = startDay === 1 ? 'last day' : getOrdinalDay(startDay - 1)
      return `Your budget will run from the ${ordinalDay} to the ${endDay} of each month`
    }

    case 'weekly': {
      const dayName = getDayOfWeekName(startDay)
      const endDayName = getDayOfWeekName((startDay + 6) % 7)
      return `Your budget will run from ${dayName} to ${endDayName} each week`
    }

    case 'bi-weekly': {
      const dayName = getDayOfWeekName(startDay)
      const endDayName = getDayOfWeekName((startDay + 6) % 7)
      return `Your budget will run for 2 weeks, from ${dayName} to ${endDayName}`
    }

    case 'custom': {
      const duration = customDuration || 30
      return `Your budget will run for ${duration} days`
    }

    default:
      return ''
  }
}
