import type { Meta, StoryObj } from '@storybook/react-vite'
import { mockCategories } from './__mocks__/categoryItemProps.mock'
import AllocatableCategoryItem from './AllocatableCategoryItem'

const meta = {
  title: 'CategoryItem/AllocatableCategoryItem',
  component: AllocatableCategoryItem,
  parameters: {
    layout: 'centered',
  },
  decorators: (Story) => {
    return (
      <div className="w-86">
        <Story />
      </div>
    )
  },
} satisfies Meta<typeof AllocatableCategoryItem>

export default meta
type Story = StoryObj<typeof meta>

export const WithInput: Story = {
  args: {
    ...mockCategories[0],
    children: (
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-400">R</span>
        <input
          type="number"
          placeholder="0"
          className="w-20 rounded-md border border-gray-300 px-2 py-1"
        />
      </div>
    ),
  },
}
