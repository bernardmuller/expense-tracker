import type { Meta, StoryObj } from '@storybook/react-vite'
import CurrentBudgetWithBadge from './CurrentBudgetWithBadge'
import { generateCurrentBudgetProps } from './__mocks__/CurrentBudget.mocks'

const currentBudgetProps = generateCurrentBudgetProps()

const meta = {
  title: 'Current Budget/With Badge',
  component: CurrentBudgetWithBadge,
} satisfies Meta<typeof CurrentBudgetWithBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { ...currentBudgetProps, daysLeft: -2 },
}

export const BudgetEnd: Story = {
  args: { ...currentBudgetProps, daysLeft: 0 },
}
