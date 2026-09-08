import type { Meta, StoryObj } from '@storybook/react-vite'
import * as IconBadge from './IconBadge.compound'
import { Calendar } from 'lucide-react'

const IconBadgeDefault = () => {
  return (
    <IconBadge.Root active={false}>
      <IconBadge.Icon>
        <Calendar className="text-foreground h-3.5 w-3.5" />
      </IconBadge.Icon>
      <span className="text-primary text-sm font-medium">12 days left</span>
    </IconBadge.Root>
  )
}

const IconBadgeActive = () => {
  return (
    <IconBadge.Root active={true}>
      <span className="text-destructive-foreground text-xs font-medium">
        Budget End
      </span>
    </IconBadge.Root>
  )
}

const meta = {
  title: 'IconBadge',
  component: IconBadgeDefault,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconBadgeDefault>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = {
  render: () => <IconBadgeActive />,
}
