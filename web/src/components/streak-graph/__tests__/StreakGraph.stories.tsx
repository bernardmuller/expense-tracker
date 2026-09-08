import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as StreakGraph from '../StreakGraph.compound'
import type { StreakCell, StreakWeek } from '../StreakGraph.types'

const DAY = 24 * 60 * 60 * 1000

function buildWeeks(days = 28): Array<StreakWeek> {
  const today = new Date()
  const start = new Date(today.getTime() - (days - 1) * DAY)
  const startOfWorkWeek = new Date(start)
  startOfWorkWeek.setDate(start.getDate() - start.getDay())

  const weeks: Array<StreakWeek> = []
  const numWeeks = Math.ceil(
    (today.getTime() - startOfWorkWeek.getTime()) / (7 * DAY),
  )

  for (let w = 0; w < numWeeks; w++) {
    const daysArr: Array<StreakCell> = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(
        startOfWorkWeek.getTime() + (w * 7 + d) * DAY,
      )
      const inRange = date >= start && date <= today
      const count = inRange ? ((w + d) % 5) : 0
      daysArr.push({
        date: date.toISOString().split('T')[0],
        count,
        level: (count as StreakCell['level']),
        inRange,
      })
    }
    weeks.push({ days: daysArr })
  }
  return weeks
}

const weeks = buildWeeks(56)

const meta = {
  title: 'Streak Graph',
  component: StreakGraph.Graph,
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <StreakGraph.Subtitle>
            Every day you open the app keeps your streak alive.
          </StreakGraph.Subtitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StreakGraph.Stats>
            <StreakGraph.Stat label="Current streak" value={12} />
            <StreakGraph.Stat label="Longest streak" value={34} />
            <StreakGraph.Stat label="Active days" value={156} />
          </StreakGraph.Stats>
          <StreakGraph.Graph weeks={weeks} />
          <StreakGraph.Legend className="justify-end" />
        </CardContent>
      </Card>
    </div>
  ),
} satisfies Meta<typeof StreakGraph.Graph>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Badge: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <StreakGraph.Badge count={12} />
      <StreakGraph.Badge count={0} />
    </div>
  ),
}
