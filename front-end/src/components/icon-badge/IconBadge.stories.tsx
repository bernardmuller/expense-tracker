import type { Meta, StoryObj } from '@storybook/react-vite'
import * as IconBadge from './IconBadge.compound'
import { Calendar } from 'lucide-react'

const IconBadgeDefault = () => {
  return (
    <IconBadge.Root active={false}>
      <IconBadge.Icon>
        <Calendar className="h-3.5 w-3.5 text-foreground" />
      </IconBadge.Icon>
      <span className="text-sm font-medium text-primary">12 days left</span>
    </IconBadge.Root>
  )
}

const IconBadgeActive = () => {
  return (
    <IconBadge.Root active={true}>
      <IconBadge.Icon>
        <Calendar className="h-3.5 w-3.5 text-primary" />
      </IconBadge.Icon>
      <span className="text-xs font-medium text-primary">12 days left</span>
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
