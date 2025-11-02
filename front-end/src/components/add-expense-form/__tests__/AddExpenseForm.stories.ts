import type { Meta, StoryObj } from '@storybook/react-vite'
import AddExpenseForm from '../AddExpenseForm'
import { generateFilterProps } from '@/components/filter/__mocks__/filterProps.mock'

const meta = {
  title: 'Add Expense Form',
  component: AddExpenseForm,
} satisfies Meta<typeof AddExpenseForm>

export default meta

const { filterItems } = generateFilterProps()

type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {
    onSubmit: (value) => {
      console.log(value)
    },
    categories: filterItems,
  },
}
