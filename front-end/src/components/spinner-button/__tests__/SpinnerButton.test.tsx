import { SpinnerButton } from '@/components/spinner-button/SpinnerButton'
import setupUserEvent from '@/lib/utils/testing/setupUserEvent'
import { render, screen } from '@testing-library/react'

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
  it('should call a function on click', async () => {
    const handleClick = vi.fn()
    const { user } = setupUserEvent(
      <SpinnerButton enabledText="Add Expense" onClick={handleClick} />,
    )
    const button = screen.getByRole('button')
    await user.click(button)
    expect(handleClick).toHaveBeenCalled()
  })
  it('should render disabled text if disabled', () => {
    const handleClick = vi.fn()
    render(
      <SpinnerButton
        enabledText="Add Expense "
        isDisabled={true}
        disabledText="Submitting"
        onClick={handleClick}
      />,
    )
    expect(screen.getByText('Submitting')).toBeInTheDocument()
  })
  it('should not be clickable if disabled', async () => {
    const handleClick = vi.fn()
    const { user } = setupUserEvent(
      <SpinnerButton
        isDisabled={true}
        disabledText="it is disabled"
        enabledText="Add Expense"
        onClick={handleClick}
      />,
    )
    const button = screen.getByRole('button')
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
