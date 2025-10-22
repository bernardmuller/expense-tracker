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
})
