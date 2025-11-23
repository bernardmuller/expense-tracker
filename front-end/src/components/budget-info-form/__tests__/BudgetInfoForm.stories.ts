import type { Meta, StoryObj } from '@storybook/react-vite'
import BudgetInfoForm from '../BudgetInfoForm'
import { generateFilterProps } from '@/components/filter/__mocks__/filterProps.mock'

const filterItems = generateFilterProps()

const meta = {
  title: 'Budget Info Form',
  component: BudgetInfoForm,
} satisfies Meta<typeof BudgetInfoForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (value) => console.log(value),
    categories: filterItems,
  },
}
