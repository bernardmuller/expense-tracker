import type { Meta, StoryObj } from '@storybook/react-vite'
import RecentExpenses from '../RecentExpenses'
import RecentExpense from '../RecentExpense'

const meta = {
  title: 'Recent Expenses',
  component: RecentExpenses,
} satisfies Meta<typeof RecentExpenses>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    linkProvider: ({ children }: { children: React.ReactNode }) => (
      <a href="/">{children}</a>
    ),
    children: (
      <>
        <RecentExpense description="Groceries" amount="R 150" emoji="🛒" />
        <RecentExpense description="Coffee" amount="R 45" emoji="☕" />
        <RecentExpense description="Gym" amount="R 250" emoji="💪" />
      </>
    ),
  },
}
