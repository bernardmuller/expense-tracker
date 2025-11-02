import { render, screen } from '@testing-library/react'
import { generateRecentExpenseProps } from '../__mocks__/RecentExpense.mock'
import RecentExpense from '../RecentExpense'

describe('RecentExpense', () => {
  it('should render the description', () => {
    const { amount, description, emoji } = generateRecentExpenseProps({
      description: 'Test Description',
    })
    render(
      <RecentExpense amount={amount} description={description} emoji={emoji} />,
    )
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument()
  })
  it('should render the amount', () => {
    const { amount, description, emoji } = generateRecentExpenseProps({
      amount: 'R1000',
    })
    render(
      <RecentExpense amount={amount} description={description} emoji={emoji} />,
    )
    expect(screen.getByText(/R1000/i)).toBeInTheDocument()
  })
  it('should render the emoji', () => {
    const { amount, description, emoji } = generateRecentExpenseProps({
      emoji: '💳',
    })
    render(
      <RecentExpense amount={amount} description={description} emoji={emoji} />,
    )
    expect(screen.getByText(/💳/i)).toBeInTheDocument()
  })
})
