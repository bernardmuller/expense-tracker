import type { Meta, StoryObj } from '@storybook/react-vite'
import OtpForm from '../OtpForm'
import { fn, expect, waitFor } from 'storybook/test'

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
    onSubmit: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const otpInput = canvas.getAllByRole('textbox')[0]
    await userEvent.type(otpInput, '123456')
    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({ otp: '123456' }),
    )
  },
}
