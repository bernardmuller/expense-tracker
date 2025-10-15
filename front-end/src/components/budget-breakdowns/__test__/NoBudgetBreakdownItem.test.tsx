import { screen, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NoBudgetBreakdownItem } from '../NoBudgetBreakdownItem'

describe('NoBudgetBreakdownItem', () => {
  it('should render header text', () => {
    render(<NoBudgetBreakdownItem />)
    expect(screen.getByText('No Expenses Yet')).toBeInTheDocument()
  })
  it('should render a description', () => {
    render(<NoBudgetBreakdownItem />)
    expect(
      screen.getByText('Start adding expenses to see your budget breakdown.'),
    ).toBeInTheDocument()
  })
})
