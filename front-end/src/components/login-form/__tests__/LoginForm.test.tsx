import { render, screen } from '@testing-library/react'
import LoginForm from '../LoginForm'
import setupUserEvent from '@/lib/utils/testing/setupUserEvent'

const MockLinkProvider = ({ children }: { children: React.ReactNode }) => (
  <a href="/">{children}</a>
)

describe('LoginForm', () => {
  it('should render header text', () => {
    render(<LoginForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
  })
  it('should render email field placeholder text', () => {
    render(<LoginForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument()
  })
  it('should render a button', () => {
    render(<LoginForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  it('should render register link text', () => {
    render(<LoginForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Register/i)).toBeInTheDocument()
  })
  it('should show validation error when button is pressed with no email entered', async () => {
    const { user } = setupUserEvent(
      <LoginForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    const submitButton = screen.getByRole('button')
    await user.click(submitButton)
    expect(
      screen.getByText('Please provide a valid email address'),
    ).toBeInTheDocument()
  })
  it('should show email validation error for invalid email format', async () => {
    const { user } = setupUserEvent(
      <LoginForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    await user.type(screen.getByPlaceholderText('Email address'), 'notanemail')
    await user.click(screen.getByRole('button'))
    expect(
      screen.getByText('Please provide a valid email address'),
    ).toBeInTheDocument()
  })
  it('should allow typing in email field', async () => {
    const { user } = setupUserEvent(
      <LoginForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    const emailField = screen.getByPlaceholderText('Email address')
    await user.type(emailField, 'john@example.com')
    expect(emailField).toHaveValue('john@example.com')
  })
  it('should call a function on submit', async () => {
    const mockFunction = vi.fn()
    const { user } = setupUserEvent(
      <LoginForm onSubmit={mockFunction} linkProvider={MockLinkProvider} />,
    )
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'john@example.com',
    )
    await user.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalled()
  })
  it('should call a function on submit with correct values', async () => {
    const mockFunction = vi.fn()
    const { user } = setupUserEvent(
      <LoginForm onSubmit={mockFunction} linkProvider={MockLinkProvider} />,
    )
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'john@example.com',
    )
    await user.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalledWith({
      email: 'john@example.com',
    })
  })
  it('should not call onSubmit when validation fails', async () => {
    const mockFunction = vi.fn()
    const { user } = setupUserEvent(
      <LoginForm onSubmit={mockFunction} linkProvider={MockLinkProvider} />,
    )
    await user.click(screen.getByRole('button'))
    expect(mockFunction).not.toHaveBeenCalled()
  })
})
