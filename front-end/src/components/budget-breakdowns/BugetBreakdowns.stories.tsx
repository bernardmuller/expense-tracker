import { fn } from 'storybook/test'

import BudgetBreakdownItem from '@/components/budget-breakdowns/BudgetBreakdownItem'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { generateBudgetBreakdownItemProps } from './__mocks__/budgetBreakDownItemProps.mock'

const meta = {
  title: 'Form/BudgetBreakdownItem',
  component: BudgetBreakdownItem,

  args: { onClick: fn() },
} satisfies Meta<typeof BudgetBreakdownItem>

export default meta
type Story = StoryObj<typeof meta>

const budgetBreakdownItemProps = generateBudgetBreakdownItemProps()

export const Primary: Story = {
  args: {
    icon: budgetBreakdownItemProps.icon,
    isOverBudget: budgetBreakdownItemProps.isOverBudget,
    isUnplanned: budgetBreakdownItemProps.isUnplanned,
    name: budgetBreakdownItemProps.name,
    percentage: budgetBreakdownItemProps.percentage,
    spent: budgetBreakdownItemProps.spent,
    planned: budgetBreakdownItemProps.planned,
  },
}
