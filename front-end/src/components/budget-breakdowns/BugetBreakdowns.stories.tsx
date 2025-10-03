import { fn } from 'storybook/test'

import BudgetBreakdownItem from '@/components/budget-breakdowns/BudgetBreakdownItem'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Form/BudgetBreakdownItem',
  component: BudgetBreakdownItem,

  args: { onClick: fn() },
} satisfies Meta<typeof BudgetBreakdownItem>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    icon: '🫡',
    isOverBudget: true,
    isUnplanned: false,
    key: 'key',
    name: 'name',
    percentage: 5,
    spent: 500,
    planned: 5,
  },
}
