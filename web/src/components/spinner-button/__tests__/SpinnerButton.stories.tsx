import type { Meta, StoryObj } from '@storybook/react-vite'
import { SpinnerButton } from '../SpinnerButton'

const meta = {
  title: 'Spinner Button',
  component: SpinnerButton,
} satisfies Meta<typeof SpinnerButton>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {
    enabledText: 'Add Expense',
    onClick: () => {},
    isDisabled: true,
    isLoading: true,
    disabledText: 'Submitting',
    className: 'min-w-30',
  },
}
