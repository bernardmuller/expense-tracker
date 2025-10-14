import { render, screen } from '@testing-library/react'
import { BudgetBreakdownItem } from '../BudgetBreakdownItem'
import {
  generateBudgetBreakdownItemProps,
  generatePlannedBudgetBreakdownItemProps,
} from '../__mocks__/budgetBreakDownItemProps.mock'

describe('BudgetBreakdownItem', () => {
  const { icon, name, spentAmount } = generateBudgetBreakdownItemProps({
    spentAmount: 'R9 942',
  })
  const { plannedAmount } = generatePlannedBudgetBreakdownItemProps({
    plannedAmount: 'R2 280',
  })
  describe('BudgetBreakdownItem.Header', () => {
    it('should render a name', () => {
      render(<BudgetBreakdownItem.Header icon={icon} name={name} />)
      expect(screen.getByText(name))
    })
    it('should render an icon', () => {
      render(<BudgetBreakdownItem.Header icon={icon} name={name} />)
      expect(screen.getByText(icon))
    })
  })
  describe('BudgetBreakdownItem.OverBudgetBadge', () => {
    it('should render over budget text', () => {
      render(<BudgetBreakdownItem.OverBudgetBadge />)
      expect(screen.getByText(/over budget/i))
    })
  })
  describe('BudgetBreakdownItem.UnplannedBadge', () => {
    it('should render unplanned text', () => {
      render(<BudgetBreakdownItem.UnplannedBadge />)
      expect(screen.getByText(/unplanned/i))
    })
  })
  describe('BudgetBreakdownItem.Planned', () => {
    it('should render "planned"', () => {
      render(<BudgetBreakdownItem.Planned amount={plannedAmount} />)
      expect(screen.getByText(/planned/i)).toBeInTheDocument()
    })
    it('should render the planned amount', () => {
      render(<BudgetBreakdownItem.Planned amount={plannedAmount} />)
      expect(screen.getByText(plannedAmount)).toBeInTheDocument()
    })
  })
  describe('BudgetBreakdownItem.Spent', () => {
    it('should render "planned"', () => {
      render(<BudgetBreakdownItem.Spent amount={spentAmount} />)
      expect(screen.getByText(/spent/i)).toBeInTheDocument()
    })
    it('should render the planned amount', () => {
      render(<BudgetBreakdownItem.Spent amount={spentAmount} />)
      expect(screen.getByText(spentAmount)).toBeInTheDocument()
    })
  })
})
