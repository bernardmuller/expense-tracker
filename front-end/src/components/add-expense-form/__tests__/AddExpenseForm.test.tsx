import { render, screen } from '@testing-library/react'
import AddExpenseForm from '../AddExpenseForm'
import { FormProvider } from '../AddExpenseForm.context'

describe('AddExpenseForm', () => {
  it('should render header text', () => {
    const { filterItems } = generateFilterProps()
    render(<AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />)
    expect(screen.getByText(/Add Expense/i)).toBeInTheDocument()
  })
  it('should render expense name field placeholder text', () => {
    const { filterItems } = generateFilterProps()
    render(<AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />)
    expect(screen.getByPlaceholderText(/Expense name/i)).toBeInTheDocument()
  })
  it('should render amount field placeholder text', () => {
    const { filterItems } = generateFilterProps()
    render(<AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />)
    expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument()
  })
  it('should render category field placeholder text', () => {
    const { filterItems } = generateFilterProps()
    render(<AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />)
    expect(screen.getByText(/Categories/i)).toBeInTheDocument()
  })
  it('should render a button', () => {
    const { filterItems } = generateFilterProps()
    render(<AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  it('should show all warnings when button is pressed with no inputs entered', async () => {
    const { filterItems } = generateFilterProps()
    const { user } = setupUserEvent(
      <AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />,
    )
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
    const { filterItems } = generateFilterProps()
    const { user } = setupUserEvent(
      <AddExpenseForm onSubmit={mockFunction} categories={filterItems} />,
    )
    await user.type(screen.getByPlaceholderText('Expense name'), 'Mackers')
    await user.type(screen.getByPlaceholderText('Amount'), '1000')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByText('Housing')[1])
    await user.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalled()
  })
  it('should call a function on submit with correct values', async () => {
    const mockFunction = vi.fn()
    const { filterItems } = generateFilterProps()
    const { user } = setupUserEvent(
      <AddExpenseForm onSubmit={mockFunction} categories={filterItems} />,
    )
    await user.type(screen.getByPlaceholderText('Expense name'), 'Mackers')
    await user.type(screen.getByPlaceholderText('Amount'), '1000')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByText('Housing')[1])
    await user.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalledWith({
      amount: 1000,
      category: 'housing',
      description: 'Mackers',
    })
  })
})
