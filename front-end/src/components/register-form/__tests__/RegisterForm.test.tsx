import { render, screen, waitFor } from '@testing-library/react'
import RegisterForm from '../RegisterForm'
import setupUserEvent from '@/lib/utils/testing/setupUserEvent'

const MockLinkProvider = ({ children }: { children: React.ReactNode }) => (
  <a href="/">{children}</a>
)

describe('RegisterForm', () => {
  it('should render header text', () => {
    render(<RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByText(/Register/i)).toBeInTheDocument()
  })
  it('should render name field placeholder text', () => {
    render(<RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument()
  })
  it('should render email field placeholder text', () => {
    render(<RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument()
  })
  it('should render a button', () => {
    render(<RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  it('should render login link text', () => {
    render(<RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />)
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Log in/i)).toBeInTheDocument()
  })
  it('should show all validation errors when button is pressed with no inputs entered', async () => {
    const { user } = setupUserEvent(
      <RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    const submitButton = screen.getByRole('button')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(
        screen.getByText('Please provide a valid email address'),
      ).toBeInTheDocument()
    })
  })
  it('should show email validation error for invalid email format', async () => {
    const { user } = setupUserEvent(
      <RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Email address'), 'notanemail')
    await user.click(screen.getByRole('button'))
    expect(
      screen.getByText('Please provide a valid email address'),
    ).toBeInTheDocument()
  })
  it('should show name length error for names exceeding 50 characters', async () => {
    const longName = 'a'.repeat(51)
    const { user } = setupUserEvent(
      <RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    await user.type(screen.getByPlaceholderText('Name'), longName)
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'john@example.com',
    )
    await user.click(screen.getByRole('button'))
    expect(
      screen.getByText("Name can't exceed 50 characters"),
    ).toBeInTheDocument()
  })
  it('should allow typing in name field', async () => {
    const { user } = setupUserEvent(
      <RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    const nameField = screen.getByPlaceholderText('Name')
    await user.type(nameField, 'John Doe')
    expect(nameField).toHaveValue('John Doe')
  })
  it('should allow typing in email field', async () => {
    const { user } = setupUserEvent(
      <RegisterForm onSubmit={vi.fn()} linkProvider={MockLinkProvider} />,
    )
    const emailField = screen.getByPlaceholderText('Email address')
    await user.type(emailField, 'john@example.com')
    expect(emailField).toHaveValue('john@example.com')
  })
  it('should call a function on submit', async () => {
    const mockFunction = vi.fn()
    const { user } = setupUserEvent(
      <RegisterForm onSubmit={mockFunction} linkProvider={MockLinkProvider} />,
    )
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe')
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
      <RegisterForm onSubmit={mockFunction} linkProvider={MockLinkProvider} />,
    )
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe')
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'john@example.com',
    )
    await user.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })
  it('should not call onSubmit when validation fails', async () => {
    const mockFunction = vi.fn()
    const { user } = setupUserEvent(
      <RegisterForm onSubmit={mockFunction} linkProvider={MockLinkProvider} />,
    )
    await user.click(screen.getByRole('button'))
    expect(mockFunction).not.toHaveBeenCalled()
  })
})
