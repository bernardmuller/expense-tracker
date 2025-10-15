import { NewBudgetModal } from '../NewBudgetModal'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'New Budget Modal',
  component: NewBudgetModal,
} satisfies Meta<typeof NewBudgetModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
