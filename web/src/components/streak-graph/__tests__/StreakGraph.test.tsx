import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as StreakGraph from '../StreakGraph.compound'
import {
  getStreakLevel,
  transformStreakToWeeks,
  type StreakSuccess,
} from '@/lib/http/queries/streak/getUserStreak'

const pad = (n: number) => String(n).padStart(2, '0')
const todayString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const emptyStreak: StreakSuccess = {
  days: [],
  currentStreak: 0,
  longestStreak: 0,
  totalActiveDays: 0,
  checkedInToday: false,
}

describe('getStreakLevel', () => {
  it('maps activity counts to 0-4 intensity buckets', () => {
    expect(getStreakLevel(0)).toBe(0)
    expect(getStreakLevel(1)).toBe(1)
    expect(getStreakLevel(3)).toBe(2)
    expect(getStreakLevel(5)).toBe(3)
    expect(getStreakLevel(42)).toBe(4)
  })
})

describe('transformStreakToWeeks', () => {
  it('builds a rectangular grid of 7-day weeks', () => {
    const weeks = transformStreakToWeeks(emptyStreak, 365)
    expect(weeks.length).toBeGreaterThanOrEqual(52)
    for (const week of weeks) {
      expect(week.days).toHaveLength(7)
    }
  })

  it("marks today's activity with the right level and in-range flag", () => {
    const today = todayString()
    const weeks = transformStreakToWeeks(
      {
        ...emptyStreak,
        days: [{ date: today, count: 4 }],
        currentStreak: 1,
        totalActiveDays: 1,
        checkedInToday: true,
      },
      365,
    )

    const cells = weeks.flatMap((w) => w.days)
    const todayCell = cells.find((c) => c.date === today)
    expect(todayCell).toBeDefined()
    expect(todayCell?.inRange).toBe(true)
    expect(todayCell?.count).toBe(4)
    expect(todayCell?.level).toBe(3)
  })
})

describe('StreakGraph parts', () => {
  it('renders a title', () => {
    render(<StreakGraph.Title>Activity</StreakGraph.Title>)
    expect(screen.getByText('Activity')).toBeInTheDocument()
  })

  it('renders a stat value and label', () => {
    render(<StreakGraph.Stat label="Current streak" value={7} />)
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('Current streak')).toBeInTheDocument()
  })

  it('renders one cell per in-range day with an accessible label', () => {
    const today = todayString()
    const weeks = transformStreakToWeeks(
      { ...emptyStreak, days: [{ date: today, count: 2 }] },
      365,
    )
    render(<StreakGraph.Graph weeks={weeks} />)
    expect(
      screen.getByLabelText(`2 opens on ${today}`),
    ).toBeInTheDocument()
  })
})
