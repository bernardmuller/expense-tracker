import type { Meta, StoryObj } from '@storybook/react-vite'
import { NoBudgetBreakdownItem } from '../NoBudgetBreakdownItem'

const meta = {
  title: 'Budget Breakdown Item/None',
  component: NoBudgetBreakdownItem,
} satisfies Meta<typeof NoBudgetBreakdownItem>

export default meta

type Story = StoryObj<typeof meta>

export const None: Story = {}
