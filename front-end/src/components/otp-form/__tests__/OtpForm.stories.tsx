import type { Meta, StoryObj } from '@storybook/react-vite'
import OtpForm from '../OtpForm'

const meta = {
  title: 'OTP',
  component: OtpForm,
} satisfies Meta<typeof OtpForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Verify OTP',
    linkProvider: ({ children }) => <a href="/">{children}</a>,
    onSubmit: (val) => console.log('Submitted:', val),
  },
}
