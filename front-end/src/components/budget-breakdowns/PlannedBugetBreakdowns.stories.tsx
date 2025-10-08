import { generatePlannedBudgetBreakdownItemProps } from './__mocks__/budgetBreakDownItemProps.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'
import PlannedBudgetBreakdownItem from '@/components/budget-breakdowns/PlannedBudgetBreakdownItem'

const meta = {
  title: 'Budget Breakdown Item/Planned',
  component: PlannedBudgetBreakdownItem,
} satisfies Meta<typeof PlannedBudgetBreakdownItem>

export default meta
type Story = StoryObj<typeof meta>

const plannedBudgetBreakdownItemProps =
  generatePlannedBudgetBreakdownItemProps()

export const Planned: Story = {
  args: {
    icon: plannedBudgetBreakdownItemProps.icon,
    name: plannedBudgetBreakdownItemProps.name,
    percentage: plannedBudgetBreakdownItemProps.percentage,
    spentAmount: plannedBudgetBreakdownItemProps.spentAmount,
    plannedAmount: plannedBudgetBreakdownItemProps.plannedAmount,
  },
}
