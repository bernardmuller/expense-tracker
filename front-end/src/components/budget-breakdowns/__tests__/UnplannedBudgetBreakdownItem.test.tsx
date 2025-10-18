import { render, screen } from '@testing-library/react'
import { generateBudgetBreakdownItemProps } from '../__mocks__/budgetBreakDownItemProps.mock'
import UnplannedBudgetBreakdownItem from '../UnplannedBudgetBreakdownItem'

describe('UnplannedBudgetBreakdownItem', () => {
  const { name, icon, spentAmount } = generateBudgetBreakdownItemProps({
    spentAmount: 'R1 253',
  })
  beforeEach(() => {
    render(
      <UnplannedBudgetBreakdownItem
        icon={icon}
        name={name}
        spentAmount={spentAmount}
      />,
    )
  })
  it('should render "unplanned"', () => {
    expect(screen.getByText(/unplanned/i)).toBeInTheDocument()
  })
  it('should render "spent"', () => {
    expect(screen.getByText(/spent/i)).toBeInTheDocument()
  })
  it('should render the spent amount', () => {
    expect(screen.getByText(spentAmount)).toBeInTheDocument()
  })
  it('should render the icon', () => {
    expect(screen.getByText(icon)).toBeInTheDocument()
  })
  it('should render the name', () => {
    expect(screen.getByText(name)).toBeInTheDocument()
  })
})
