import type { Meta, StoryObj } from '@storybook/react-vite'
import { mockCategories } from './__mocks__/categoryItemProps.mock'
import SelectableCategoryItem from './SelectableCategoryItem'

const meta = {
  title: 'CategoryItem/SelectableCategoryItem',
  component: SelectableCategoryItem,
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
  args: {
    onCheckedChange: () => {},
  },
} satisfies Meta<typeof SelectableCategoryItem>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  args: {
    ...mockCategories[0],
    checked: false,
  },
}

export const Checked: Story = {
  args: {
    ...mockCategories[0],
    checked: true,
  },
}
