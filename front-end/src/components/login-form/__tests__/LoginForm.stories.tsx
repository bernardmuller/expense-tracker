import type { Meta, StoryObj } from '@storybook/react-vite'
import LoginForm from '../LoginForm'

const meta = {
  title: 'LoginForm',
  component: LoginForm,
  args: {
    onSubmit: () => {},
    linkProvider: ({ children }: { children: React.ReactNode }) => (
      <a href="/">{children}</a>
    ),
  },
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
