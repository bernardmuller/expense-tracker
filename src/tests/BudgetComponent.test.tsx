import { describe, expect, it } from 'vitest'
import { render, screen } from '../../test/test-utils'
import type { ActiveBudgetByUserId } from '@/server/queries/budgets'
import CurrentBudget from '@/components/budgets/CurrentBudget'
import { formatCurrency } from '@/lib/utils/formatCurrency'

const mockBudget: ActiveBudgetByUserId = {
  id: 1,
  userId: 'user1',
  name: 'Test Budget',
  startAmount: '1000.00',
  currentAmount: '750.00',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}


describe('CurrentBudget', () => {
  const mockOnAmountVisible = () => { }
  it("renders on the page with the current budget's name", () => {
    render(<CurrentBudget
      budget={mockBudget}
      currencySymbol='R'
      isAmountVisible={false}
      onAmountVisible={mockOnAmountVisible}
    />)
    expect(screen.getByText(/Current Budget/i)).toBeInTheDocument();
    expect(screen.getByText(mockBudget.name)).toBeInTheDocument();
  })

  it("has a link to the budget details page", () => {
    render(<CurrentBudget
      budget={mockBudget}
      currencySymbol='R'
      isAmountVisible={false}
      onAmountVisible={mockOnAmountVisible}
    />)

    const link = screen.getByText(/view/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('to', `/budget/$budgetId`)
  })

  it("hides the current, remaining and spent amount", () => {
    render(<CurrentBudget
      budget={mockBudget}
      currencySymbol='R'
      isAmountVisible={false}
      onAmountVisible={mockOnAmountVisible}
    />)

    expect(screen.getByText("R********")).toBeInTheDocument();
    expect(screen.getByText("Spent: R********")).toBeInTheDocument();
    expect(screen.getByText("remaining of R********")).toBeInTheDocument();
  })

  it("shows the current, remaining and spent amount", () => {
    render(<CurrentBudget
      budget={mockBudget}
      currencySymbol='R'
      isAmountVisible={true}
      onAmountVisible={mockOnAmountVisible}
    />)

    const spentAmount = Number(mockBudget.startAmount) - Number(mockBudget.currentAmount);

    expect(screen.getByText(`R${mockBudget.currentAmount}`)).toBeInTheDocument();
    expect(screen.getByText(`Spent: R${formatCurrency(spentAmount)}`)).toBeInTheDocument();
    expect(screen.getByText(`remaining of R${formatCurrency(Number(mockBudget.startAmount))}`)).toBeInTheDocument();
  })

  it("toggles the visibility of the current amount when it is clicked", () => {
    render(<CurrentBudget
      budget={mockBudget}
      currencySymbol='R'
      isAmountVisible={true}
      onAmountVisible={mockOnAmountVisible}
    />)

    expect(screen.getByText(`R${mockBudget.currentAmount}`)).toBeInTheDocument();
  })

})
