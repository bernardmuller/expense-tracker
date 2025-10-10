import { screen, render } from '@testing-library/react'
import { generateOverBudgetBreakdownItemProps } from './__mocks__/budgetBreakDownItemProps.mock'
import OverBudgetBreakdownItem from './OverBudgetBreakdownItem'

describe('OverBudgetBreakdownItem', () => {
  const { name, icon, spentAmount, plannedAmount } =
    generateOverBudgetBreakdownItemProps({
      spentAmount: 'R1 253',
      plannedAmount: 'R1 000',
    })
  beforeEach(() => {
    render(
      <OverBudgetBreakdownItem
        icon={icon}
        name={name}
        spentAmount={spentAmount}
        plannedAmount={plannedAmount}
      />,
    )
  })
  it('should render "over budget"', () => {
    expect(screen.getByText(/over budget/i)).toBeInTheDocument()
  })
  it('should render "spent"', () => {
    expect(screen.getByText(/spent/i)).toBeInTheDocument()
  })
  it('should render the spent amount', () => {
    expect(screen.getByText(spentAmount)).toBeInTheDocument()
  })
  it('should render the planned amount', () => {
    expect(screen.getByText(plannedAmount)).toBeInTheDocument()
  })
  it('should render the icon', () => {
    expect(screen.getByText(icon)).toBeInTheDocument()
  })
  it('should render the name', () => {
    expect(screen.getByText(name)).toBeInTheDocument()
  })
})
