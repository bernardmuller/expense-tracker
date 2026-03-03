import type { Meta, StoryObj } from '@storybook/react-vite'
import CategoryChart from '../CategoryChart'
import {
  generateCategoryChartProps,
  generateUnderBudgetCategoryChartProps,
  generateOverBudgetCategoryChartProps,
  generateMixedBudgetCategoryChartProps,
} from '../__mocks__/categoryChartProps.mock'

const meta = {
  title: 'Category Chart',
  component: CategoryChart,
} satisfies Meta<typeof CategoryChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: generateCategoryChartProps(),
}

export const UnderBudget: Story = {
  args: generateUnderBudgetCategoryChartProps(),
}

export const OverBudget: Story = {
  args: generateOverBudgetCategoryChartProps(),
}

export const Mixed: Story = {
  args: generateMixedBudgetCategoryChartProps(),
}

export const CustomCategory: Story = {
  args: generateCategoryChartProps({
    categoryName: 'Dining Out',
    description: 'Restaurant and takeout expenses',
  }),
}

export const EmptyData: Story = {
  args: generateCategoryChartProps({
    data: [],
    categoryName: 'New Category',
    description: 'No data available yet',
  }),
}
