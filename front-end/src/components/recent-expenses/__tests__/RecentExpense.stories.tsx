import type { Meta, StoryObj } from '@storybook/react-vite'
import { generateRecentExpenseProps } from '../__mocks__/RecentExpense.mock'
import RecentExpense from '../RecentExpense'

const meta = {
  title: 'Recent Expense',
  component: RecentExpense,
} satisfies Meta<typeof RecentExpense>

export default meta

type Story = StoryObj<typeof meta>

const { amount, description, emoji } = generateRecentExpenseProps()

export const WithEmoji: Story = {
  args: {
    description: description,
    emoji: emoji,
    amount: amount,
  },
}
