import type { Meta, StoryObj } from '@storybook/react-vite'
import RegisterForm from '../RegisterForm'

const meta = {
  title: 'Register',
  component: RegisterForm,
} satisfies Meta<typeof RegisterForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    linkProvider: ({ children }: { children: React.ReactNode }) => (
      <a href="/">{children}</a>
    ),
    onSubmit: (val) => console.log(val),
  },
}
