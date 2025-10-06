import DefaultBudgetBreakdownItem from '@/components/budget-breakdowns/DefaultBudgetBreakdownItem'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { generateDefaultBudgetBreakdownItemProps } from './__mocks__/budgetBreakDownItemProps.mock'

const meta = {
  title: 'Budget Breakdown Item/Default',
  component: DefaultBudgetBreakdownItem,
} satisfies Meta<typeof DefaultBudgetBreakdownItem>

export default meta
type Story = StoryObj<typeof meta>

const defaultBudgetBreakdownItemProps =
  generateDefaultBudgetBreakdownItemProps()

export const Default: Story = {
  args: {
    icon: defaultBudgetBreakdownItemProps.icon,
    name: defaultBudgetBreakdownItemProps.name,
    percentage: defaultBudgetBreakdownItemProps.percentage,
    spentAmount: defaultBudgetBreakdownItemProps.spentAmount,
  },
}
