import { render, screen } from '@testing-library/react'
import { generatePlannedBudgetBreakdownItemProps } from '../__mocks__/budgetBreakDownItemProps.mock'
import PlannedBudgetBreakdownItem from '../PlannedBudgetBreakdownItem'

describe('PlannedBudgetBreakdownItem', () => {
  const { name, icon, spentAmount, plannedAmount, percentage } =
    generatePlannedBudgetBreakdownItemProps({
      spentAmount: 'R1 253',
      plannedAmount: 'R1 000',
    })
  beforeEach(() => {
    render(
      <PlannedBudgetBreakdownItem
        icon={icon}
        name={name}
        spentAmount={spentAmount}
        plannedAmount={plannedAmount}
        percentage={percentage}
      />,
    )
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
