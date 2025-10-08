import { generateBudgetBreakdownItemProps } from './__mocks__/budgetBreakDownItemProps.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'
import UnplannedBudgetBreakdownItem from '@/components/budget-breakdowns/UnplannedBudgetBreakdownItem'

const meta = {
  title: 'Budget Breakdown Item/Unplanned',
  component: UnplannedBudgetBreakdownItem,
} satisfies Meta<typeof UnplannedBudgetBreakdownItem>

export default meta
type Story = StoryObj<typeof meta>

const defaultBudgetBreakdownItemProps = generateBudgetBreakdownItemProps()

export const Unplanned: Story = {
  args: {
    icon: defaultBudgetBreakdownItemProps.icon,
    name: defaultBudgetBreakdownItemProps.name,
    spentAmount: defaultBudgetBreakdownItemProps.spentAmount,
  },
}
