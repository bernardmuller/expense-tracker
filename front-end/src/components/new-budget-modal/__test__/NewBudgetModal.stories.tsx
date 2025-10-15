import type { StoryObj, Meta } from '@storybook/react-vite'
import { NewBudgetModal } from '../NewBudgetModal'

const meta = {
  title: 'New Budget Modal',
  component: NewBudgetModal,
} satisfies Meta<typeof NewBudgetModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
