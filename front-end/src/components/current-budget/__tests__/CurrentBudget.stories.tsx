import type { Meta, StoryObj } from '@storybook/react-vite'
import { CurrentBudget } from '../CurrentBudget'
import {
    generateCurrentBudgetProps
} from '../__mocks__/CurrentBudget.mocks'

const currentBudgetProps = generateCurrentBudgetProps()

const meta = {
  title: 'Current Budget',
  component: CurrentBudget,
} satisfies Meta<typeof CurrentBudget>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { ...currentBudgetProps },
}
