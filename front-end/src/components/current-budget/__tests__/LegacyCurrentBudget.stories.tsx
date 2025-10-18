import type { Meta, StoryObj } from '@storybook/react-vite'
import { LegacyCurrentBudget } from '../LegacyCurrentBudget'

const meta = {
  title: 'Legacy Current Budget',
  component: LegacyCurrentBudget,
} satisfies Meta<typeof LegacyCurrentBudget>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
