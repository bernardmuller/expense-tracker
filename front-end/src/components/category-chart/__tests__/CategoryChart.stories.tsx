import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import CategoryChart from '../CategoryChart'
import {
  generateCategoryChartProps,
  generateUnderBudgetCategoryChartProps,
  generateOverBudgetCategoryChartProps,
  generateMixedBudgetCategoryChartProps,
} from '../__mocks__/categoryChartProps.mock'
import { format } from 'date-fns'

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

export const SparseData: Story = {
  args: generateCategoryChartProps({
    data: [
      {
        month: format(new Date('2025-10-01'), 'MMM'),
        spent: undefined,
        budget: undefined,
      },
      {
        month: format(new Date('2025-11-01'), 'MMM'),
        spent: undefined,
        budget: undefined,
      },
      {
        month: format(new Date('2025-12-01'), 'MMM'),
        spent: undefined,
        budget: undefined,
      },
      // { month: format(new Date('2026-01-01'), 'MMM'), spent: 67, budget: 175 },
      // { month: format(new Date('2026-02-01'), 'MMM'), spent: 199, budget: 300 },
      // { month: format(new Date('2026-03-01'), 'MMM'), spent: 478, budget: 350 },
      { month: format(new Date('2026-01-01'), 'MMM'), spent: 67, budget: 175 },
      { month: format(new Date('2026-02-01'), 'MMM'), spent: 199, budget: 300 },
      { month: format(new Date('2026-03-01'), 'MMM'), spent: 478, budget: 350 },
    ],
    categoryName: 'New Category',
  }),
}

export const InteractiveHoverAndActive: Story = {
  // @ts-ignore: it works
  args: {},
  render: () => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(
      undefined,
    )

    return (
      <div className="space-y-4">
        <div className="rounded border p-4">
          <p className="mb-2 font-sans text-sm text-gray-600">
            <strong>Try this:</strong>
          </p>
          <ul
            className="list-inside list-disc space-y-1 font-sans text-xs
              text-gray-500"
          >
            <li>Hover over any bar to preview (temporary highlight)</li>
            <li>Click a bar to set it as active (persists)</li>
            <li>Hover other bars while one is active - hover takes priority</li>
            <li>Click outside to clear active state</li>
          </ul>
          {activeIndex !== undefined && (
            <p className="mt-2 font-sans text-xs font-semibold text-blue-600">
              Active bar index: {activeIndex}
            </p>
          )}
        </div>
        <CategoryChart
          {...generateCategoryChartProps()}
          activeIndex={activeIndex}
          onBarClick={(index) => setActiveIndex(index)}
          onBlur={() => setActiveIndex(undefined)}
        />
      </div>
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
