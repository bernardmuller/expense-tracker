
import Filter from '../Filter'
import { generateFilterProps } from '../__mocks__/filterProps.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'

const { filterItems, handleValueChange, placeHolder } = generateFilterProps()

const meta = {
  title: 'Filter/Default',
  component: Filter,
} satisfies Meta<typeof Filter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    filterItems: filterItems,
    handleValueChange: handleValueChange,
    placeHolder: placeHolder,
    rootClassName: 'w-full',
  },
}
