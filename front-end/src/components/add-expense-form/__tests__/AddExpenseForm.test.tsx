import setupUserEvent from '@/lib/utils/testing/setupUserEvent'
import { render, screen } from '@testing-library/react'
import AddExpenseForm from '../AddExpenseForm'

describe('AddExpenseForm', () => {
  it('should render header text', () => {
    render(<AddExpenseForm onSubmit={vi.fn()} />)
    expect(screen.getByText(/Add Expense/i)).toBeInTheDocument()
  })
  it('should render expense name field placeholder text', () => {
    render(<AddExpenseForm onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText(/Expense name/i)).toBeInTheDocument()
  })
  it('should render amount field placeholder text', () => {
    render(<AddExpenseForm onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument()
  })
  it('should render category field placeholder text', () => {
    render(<AddExpenseForm onSubmit={vi.fn()} />)
    expect(screen.getByText(/Categories/i)).toBeInTheDocument()
  })
  it('should render a button', () => {
    render(<AddExpenseForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  it('should show all warnings when button is pressed with no inputs entered', async () => {
    const { user } = setupUserEvent(<AddExpenseForm onSubmit={vi.fn()} />)
    const submitButton = screen.getByRole('button')
    await user.click(submitButton)
    expect(
      screen.getByText('You must provide a description'),
    ).toBeInTheDocument()
    expect(screen.getByText('You must provide the amount')).toBeInTheDocument()
    expect(screen.getByText('You must specify a category')).toBeInTheDocument()
  })
  it('should call a function on submit', async () => {
    const mockFunction = vi.fn()
    const { user } = setupUserEvent(<AddExpenseForm onSubmit={mockFunction} />)
    await user.type(screen.getByPlaceholderText('Expense name'), 'Mackers')
    await user.type(screen.getByPlaceholderText('Amount'), '1000')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByText('Housing')[1])
    await user.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalled()
  })
})
