import { act, fireEvent, render, screen } from '@testing-library/react'
import { CurrentBudget } from '../CurrentBudget'

import { generateCurrentBudgetProps } from '../__mocks__/CurrentBudget.mocks'

describe('CurrentBudget', async () => {
  const {
    budgetName,
    currentAmount,
    onClick,
    spentAmount,
    spentPercentage,
    startingAmount,
    linkProvider
  } = generateCurrentBudgetProps({
    onClick: vi.fn(),
    spentPercentage: 25,
    currentAmount: 'R3 000',
    spentAmount: 'R1 000',
    startingAmount: 'R4 000',
  })

  beforeEach(
    async () =>
      await act(() =>
        render(
          <CurrentBudget
            budgetName={budgetName}
            currentAmount={currentAmount}
            onClick={onClick}
            spentAmount={spentAmount}
            spentPercentage={spentPercentage}
            startingAmount={startingAmount}
            linkProvider={linkProvider}
          />,
        ),
      ),
  )

  describe('Title', () => {
    it('should render title text', () => {
      expect(screen.getByText('Current Budget')).toBeInTheDocument()
    })
  })
  it('should render the budget name', () => {
    expect(screen.getByText(budgetName)).toBeInTheDocument()
  })
  describe('ViewTrigger', () => {
    it('should render "View" text', async () => {
      expect(screen.getByText('View')).toBeInTheDocument()
    })
    it('should render a link', async () => {
      expect(screen.getByRole('link')).toBeInTheDocument()
    })
  })
  describe('HideTrigger', () => {
    it('should render a button', () => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    it('should call a function handleClick', () => {
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(onClick).toHaveBeenCalled()
    })
  })
  describe('RemainingAmount', () => {
    it('should render an amount', () => {
      expect(
        screen.getByText(`remaining of ${startingAmount}`),
      ).toBeInTheDocument()
    })
  })
  describe('CurrentAmount', () => {
    it('should render an amount', () => {
      expect(screen.getByText(currentAmount)).toBeInTheDocument()
    })
  })
  describe('SpentAmount', () => {
    it('should render an amount', () => {
      expect(screen.getByText(`Spent: ${spentAmount}`)).toBeInTheDocument()
    })
  })
  describe('SpentPercentage', () => {
    it('should render a percentage', () => {
      expect(screen.getByText(`25.0%`)).toBeInTheDocument()
    })
  })
})
