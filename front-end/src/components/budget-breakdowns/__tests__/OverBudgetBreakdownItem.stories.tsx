import { generateOverBudgetBreakdownItemProps } from '../__mocks__/budgetBreakDownItemProps.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'
import OverBudgetBreakdownItem from '@/components/budget-breakdowns/OverBudgetBreakdownItem'

const meta = {
  title: 'Budget Breakdown Item/Over',
  component: OverBudgetBreakdownItem,
} satisfies Meta<typeof OverBudgetBreakdownItem>

export default meta
type Story = StoryObj<typeof meta>

const overBudgetBreakdownItemProps =
  generateOverBudgetBreakdownItemProps()

export const Over: Story = {
  args: {
    icon: overBudgetBreakdownItemProps.icon,
    name: overBudgetBreakdownItemProps.name,
    spentAmount: overBudgetBreakdownItemProps.spentAmount,
    plannedAmount: overBudgetBreakdownItemProps.plannedAmount,
  },
}
