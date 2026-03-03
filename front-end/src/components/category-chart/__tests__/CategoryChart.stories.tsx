// import { generateOverBudgetBreakdownItemProps } from '../__mocks__/budgetBreakDownItemProps.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'
import CategoryChart from '../CategoryChart'

const meta = {
  title: 'Category Chart',
  component: CategoryChart,
} satisfies Meta<typeof CategoryChart>

export default meta
type Story = StoryObj<typeof meta>

// const overBudgetBreakdownItemProps = generateOverBudgetBreakdownItemProps()

export const Default: Story = {}
