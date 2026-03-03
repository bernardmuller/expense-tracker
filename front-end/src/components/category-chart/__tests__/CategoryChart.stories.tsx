import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
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
  argTypes: {
    currency: {
      control: 'text',
      description: 'Currency symbol to display',
    },
    activeIndex: {
      control: 'number',
      description: 'Index of the active bar',
    },
  },
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

export const DollarCurrency: Story = {
  args: generateCategoryChartProps({
    categoryName: 'US Expenses',
    currency: '$',
  }),
}

export const EuroCurrency: Story = {
  args: generateCategoryChartProps({
    categoryName: 'EU Expenses',
    currency: '€',
  }),
}

export const WithActiveBar: Story = {
  args: generateCategoryChartProps({
    activeIndex: 2,
  }),
}

export const InteractiveActiveState: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(
      undefined,
    )

    return (
      <CategoryChart
        {...generateCategoryChartProps()}
        activeIndex={activeIndex}
        onBarClick={(index) => setActiveIndex(index)}
        onBlur={() => setActiveIndex(undefined)}
      />
    )
  },
}

export const EmptyData: Story = {
  args: generateCategoryChartProps({
    data: [],
    categoryName: 'New Category',
    description: 'No data available yet',
  }),
}
