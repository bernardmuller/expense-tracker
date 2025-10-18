import { screen, render, fireEvent } from '@testing-library/react'
import { SpinnerButton } from '../SpinnerButton'

describe('SpinnerButton', () => {
  it('render default text', () => {
    const handleClick = vi.fn()
    render(<SpinnerButton enabledText="Add Expense" onClick={handleClick} />)
    expect(screen.getByText('Add Expense')).toBeInTheDocument()
  })
  it('should render a button', () => {
    const handleClick = vi.fn()
    render(<SpinnerButton enabledText="Add Expense" onClick={handleClick} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  it('should call a function on click', () => {
    const handleClick = vi.fn()
    render(<SpinnerButton enabledText="Add Expense" onClick={handleClick} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalled()
  })
  it('should render disabled text if disabled', () => {
    const handleClick = vi.fn()
    render(
      <SpinnerButton
        enabledText="Add Expense "
        disabled={true}
        disabledText="Submitting"
        onClick={handleClick}
      />,
    )
    expect(screen.getByText('Submitting')).toBeInTheDocument()
  })
  it('should not be clickable if disabled', () => {
    const handleClick = vi.fn()
    render(
      <SpinnerButton
        enabledText="Add Expense "
        disabled={true}
        disabledText="Submitting"
        onClick={handleClick}
      />,
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
