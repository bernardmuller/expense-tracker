import { render, screen } from '@testing-library/react'
import AddExpenseForm from '../AddExpenseForm'
import { generateFilterProps } from '@/components/filter/__mocks__/filterProps.mock'
import setupUserEvent from '@/lib/utils/testing/setupUserEvent'

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
    // expect(
    //   screen.getByText('You must provide a description'),
    // ).toBeInTheDocument()
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
      createdAt: undefined,
      note: undefined,
    })
  })
  it('should use capitalized category name as description when no description is provided', async () => {
    const mockFunction = vi.fn()
    const { filterItems } = generateFilterProps()
    const { user } = setupUserEvent(
      <AddExpenseForm onSubmit={mockFunction} categories={filterItems} />,
    )
    await user.type(screen.getByPlaceholderText('Amount'), '500')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByText('Housing')[1])
    await user.click(screen.getByRole('button'))
    expect(mockFunction).toHaveBeenCalledWith({
      amount: 500,
      category: 'housing',
      description: 'Housing',
      createdAt: undefined,
      note: undefined,
    })
  })
  it('should render a "+ Show advanced options" button', () => {
    const { filterItems } = generateFilterProps()
    render(<AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />)
    expect(
      screen.getByRole('button', { name: /show advanced options/i }),
    ).toBeInTheDocument()
  })
  it('should not show date or note fields by default', () => {
    const { filterItems } = generateFilterProps()
    render(<AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />)
    expect(screen.queryByText(/Pick a date/i)).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/Note/i)).not.toBeInTheDocument()
  })
  it('should reveal date and note fields after clicking "+ Show advanced options"', async () => {
    const { filterItems } = generateFilterProps()
    const { user } = setupUserEvent(
      <AddExpenseForm onSubmit={vi.fn()} categories={filterItems} />,
    )
    await user.click(
      screen.getByRole('button', { name: /show advanced options/i }),
    )
    expect(screen.getByText(/Pick a date/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Note/i)).toBeInTheDocument()
  })
  it('should call submit with note when advanced fields are shown', async () => {
    const mockFunction = vi.fn()
    const { filterItems } = generateFilterProps()
    const { user } = setupUserEvent(
      <AddExpenseForm onSubmit={mockFunction} categories={filterItems} />,
    )
    await user.type(screen.getByPlaceholderText('Expense name'), 'Mackers')
    await user.type(screen.getByPlaceholderText('Amount'), '1000')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByText('Housing')[1])
    await user.click(
      screen.getByRole('button', { name: /show advanced options/i }),
    )
    await user.type(screen.getByPlaceholderText(/Note/i), 'Test note')
    await user.click(screen.getByRole('button', { name: /Create Expense/i }))
    expect(mockFunction).toHaveBeenCalledWith({
      amount: 1000,
      category: 'housing',
      description: 'Mackers',
      createdAt: undefined,
      note: 'Test note',
    })
  })
})
