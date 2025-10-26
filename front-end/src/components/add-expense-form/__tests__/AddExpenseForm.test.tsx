import { render, screen } from '@testing-library/react'
import AddExpenseForm from '../AddExpenseForm'
import { FormProvider } from '../AddExpenseForm.context'

describe('AddExpenseForm', () => {
  it('should render header text', () => {
    render(
      <FormProvider>
        <AddExpenseForm />
      </FormProvider>,
    )
    expect(screen.getByText(/Add Expense/i)).toBeInTheDocument()
  })
  // it('should render expense name field placeholder text', () => {
  //   render(<AddExpenseForm />)
  //   expect(screen.getByPlaceholderText(/Expense name/i)).toBeInTheDocument()
  // })
  // it('should render amount field placeholder text', () => {
  //   render(<AddExpenseForm />)
  //   expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument()
  // })
  // it('should render category field placeholder text', () => {
  //   render(<AddExpenseForm />)
  //   expect(screen.getByText(/Categories/i)).toBeInTheDocument()
  // })
  // it('should render a button', () => {
  //   render(<AddExpenseForm />)
  //   expect(screen.getByRole('button')).toBeInTheDocument()
  // })
  // it('should show all warnings when button is pressed with no inputs entered', async () => {
  //   const { user } = setupUserEvent(<AddExpenseForm />)
  //   const submitButton = screen.getByRole('button')
  //   await user.click(submitButton)
  //   expect(
  //     screen.getByText('You must provide a description'),
  //   ).toBeInTheDocument()
  //   expect(screen.getByText('You must provide the amount')).toBeInTheDocument()
  //   expect(screen.getByText('You must specify a category')).toBeInTheDocument()
  // })
  // it('should call a function on submit', async () => {
  //   const mockFunction = vi.fn()
  //   const { user } = setupUserEvent(<AddExpenseForm onSubmit={mockFunction} />)
  //   await user.type(screen.getByPlaceholderText('Expense name'), 'Mackers')
  //   await user.type(screen.getByPlaceholderText('Amount'), '1000')
  //   await user.click(screen.getByRole('combobox'))
  //   await user.click(screen.getAllByText('Housing')[1])
  //   await user.click(screen.getByRole('button'))
  //   expect(mockFunction).toHaveBeenCalled()
  // })
})
