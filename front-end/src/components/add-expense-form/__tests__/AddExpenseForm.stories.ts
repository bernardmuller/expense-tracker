import type { Meta, StoryObj } from '@storybook/react-vite'
import AddExpenseForm from '../AddExpenseForm'

const meta = {
  title: 'Add Expense Form',
  component: AddExpenseForm,
} satisfies Meta<typeof AddExpenseForm>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {
    onSubmit: (value) => {
      console.log(value)
    },
  },
}
