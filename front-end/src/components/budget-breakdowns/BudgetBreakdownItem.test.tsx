import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BudgetBreakdownItem } from './BudgetBreakdownItem'
import { generateBudgetBreakdownItemProps } from './__mocks__/budgetBreakDownItemProps.mock'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params, search }: any) => {
    const searchString = search
      ? `?${new URLSearchParams(search).toString()}`
      : ''
    return (
      <a
        href={`${to}${searchString}`}
        data-to={to}
        data-params={params ? JSON.stringify(params) : undefined}
        data-search={search ? JSON.stringify(search) : undefined}
      >
        {children}
      </a>
    )
  },
}))

describe('BudgetBreakdownItem', () => {
  const budgetBreakdownItemProps = generateBudgetBreakdownItemProps()
  describe('Root Component', () => {
    it('should render children', () => {
      render(
        <BudgetBreakdownItem>
          <div>Test Root Content</div>
        </BudgetBreakdownItem>,
      )
      expect(screen.getByText('Test Root Content')).toBeInTheDocument()
    })
    it('card has border class', () => {
      render(
        <BudgetBreakdownItem>
          <div>Test Root Content</div>
        </BudgetBreakdownItem>,
      )
      const card = screen.getByTestId('budgetBreakdownItem')

      expect(card).toHaveClass('border-border/50')
    })
  })
  describe('BudgetBreakdownItem.Link', () => {
    it('should render children', () => {
      render(
        <BudgetBreakdownItem.Link url="/">
          <div>Test Link Content</div>
        </BudgetBreakdownItem.Link>,
      )
      expect(screen.getByText('Test Link Content')).toBeInTheDocument()
    })
  })
  describe('BudgetBreakdownItem.Header', () => {
    it('should render children', () => {
      render(
        <BudgetBreakdownItem.Header
          name={budgetBreakdownItemProps.name}
          icon={budgetBreakdownItemProps.icon}
        >
          <div>Test Header Content</div>
        </BudgetBreakdownItem.Header>,
      )
      expect(screen.getByText('Test Header Content')).toBeInTheDocument()
    })
    it('should render the name property', () => {
      render(
        <BudgetBreakdownItem.Header
          name={budgetBreakdownItemProps.name}
          icon={budgetBreakdownItemProps.icon}
        >
          <div>Test Header Content</div>
        </BudgetBreakdownItem.Header>,
      )
      expect(
        screen.getByText(budgetBreakdownItemProps.name),
      ).toBeInTheDocument()
    })
    it('should render the icon', () => {
      render(
        <BudgetBreakdownItem.Header
          name={budgetBreakdownItemProps.name}
          icon={budgetBreakdownItemProps.icon}
        >
          <div>Test Header Content</div>
        </BudgetBreakdownItem.Header>,
      )
      expect(
        screen.getByText(budgetBreakdownItemProps.icon),
      ).toBeInTheDocument()
    })
    it('should display items in a row centered with space between', () => {
      render(
        <BudgetBreakdownItem.Header
          name={budgetBreakdownItemProps.name}
          icon={budgetBreakdownItemProps.icon}
        >
          <div>Test Header Content</div>
        </BudgetBreakdownItem.Header>,
      )
      const headerRootDivider = screen.getByTestId('headerRootDivider')
      expect(headerRootDivider).toHaveClass('flex justify-between items-center')
    })
  })
  describe('BudgetBreakdownItem Badges', () => {
    describe('Over Budget Badge', () => {
      it('should render a badge ', () => {
        render(<BudgetBreakdownItem.OverBudget />)
        const overBudgetBadge = screen.getByTestId('overBudgetBadge')
        expect(overBudgetBadge).toBeInTheDocument()
      })
      it('should render text saying "Over budget"', () => {
        render(<BudgetBreakdownItem.OverBudget />)
        expect(screen.getByText('Over budget')).toBeInTheDocument()
      })
      it('has destructive variant class', () => {
        render(<BudgetBreakdownItem.OverBudget />)

        const badge = screen.getByTestId('overBudgetBadge')
        expect(badge).toHaveClass(
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        )
      })
    })
    describe('Unplanned Budget Badge', () => {
      it('should render a badge ', () => {
        render(<BudgetBreakdownItem.Unplanned />)
        const unplannedBadge = screen.getByTestId('unplannedBudgetBadge')
        expect(unplannedBadge).toBeInTheDocument()
      })
      it('should render text saying "Unplanned"', () => {
        render(<BudgetBreakdownItem.Unplanned />)
        expect(screen.getByText('Unplanned')).toBeInTheDocument()
      })
      it('has outline variant class', () => {
        render(<BudgetBreakdownItem.Unplanned />)

        const badge = screen.getByTestId('unplannedBudgetBadge')
        expect(badge).toHaveClass(
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        )
      })
    })
  })
  describe('Progress Bars', () => {
    vi.mock('@/components/ui/progress', () => ({
      Progress: vi.fn(({ value, className, 'data-testid': testId }) => (
        <div data-testid={testId} data-value={value} className={className}>
          Progress: {value}%
        </div>
      )),
    }))
    describe('BudgetBreakdownItem.Progress', () => {
      it('renders with the correct percentage value', () => {
        render(<BudgetBreakdownItem.Progress percentage={75} />)

        const progress = screen.getByTestId('progress')
        expect(progress).toBeInTheDocument()
        expect(progress).toHaveAttribute('data-value', '75')
      })

      it('renders with 0 percentage', () => {
        render(<BudgetBreakdownItem.Progress percentage={0} />)

        const progress = screen.getByTestId('progress')
        expect(progress).toHaveAttribute('data-value', '0')
      })

      it('renders with 100 percentage', () => {
        render(<BudgetBreakdownItem.Progress percentage={100} />)

        const progress = screen.getByTestId('progress')
        expect(progress).toHaveAttribute('data-value', '100')
      })

      it('applies the correct className', () => {
        render(<BudgetBreakdownItem.Progress percentage={50} />)

        const progress = screen.getByTestId('progress')
        expect(progress).toHaveClass('h-1')
      })
    })
    describe('BudgetBreakdownItem.DisabledProgress', () => {
      it('renders with correct styling', () => {
        render(<BudgetBreakdownItem.DisabledProgress />)

        const progress = screen.getByTestId('progressDisabled')
        expect(progress).toBeInTheDocument()
        expect(progress).toHaveClass('bg-primary/10', 'h-1')
      })
    })

    describe('BudgetBreakdownItem.OverBudgetProgress', () => {
      it('renders with correct styling', () => {
        render(<BudgetBreakdownItem.OverBudgetProgress />)

        const progress = screen.getByTestId('progressOverBudget')
        expect(progress).toBeInTheDocument()
        expect(progress).toHaveClass('h-1', 'bg-red-500/50')
      })
    })
  })
  describe('BudgetBreakdownItem.Stats', () => {
    it('renders children', () => {
      render(
        <BudgetBreakdownItem.Stats>
          <div>Stats content</div>
        </BudgetBreakdownItem.Stats>,
      )
      expect(screen.getByText('Stats content')).toBeInTheDocument()
    })
    it('renders elements with 2 y spacing', () => {
      render(
        <BudgetBreakdownItem.Stats>
          <div>Stats content</div>
        </BudgetBreakdownItem.Stats>,
      )
      const statsContainer = screen.getByTestId('statsContainer')
      expect(statsContainer).toHaveClass('space-y-2')
    })
  })
  describe('BudgetBreakdownItem.Spent', () => {
    it('should render "Spent:" text', () => {
      render(
        <BudgetBreakdownItem.Spent
          amount={budgetBreakdownItemProps.spentAmount}
        />,
      )
      expect(screen.getByText('Spent:')).toBeInTheDocument()
    })
    it('should render the spent amount prop', () => {
      render(<BudgetBreakdownItem.Spent amount={'R10 000'} />)
      expect(screen.getByText('R10 000')).toBeInTheDocument()
    })
  })
  describe('BudgetBreakdownItem.ReverseRow', () => {
    it('should render children', () => {
      render(
        <BudgetBreakdownItem.ReverseRow>
          <div>Reverse Row content</div>
        </BudgetBreakdownItem.ReverseRow>,
      )
      expect(screen.getByText('Reverse Row content')).toBeInTheDocument()
    })
    it('should have the flex-row-reverse class', () => {
      render(
        <BudgetBreakdownItem.ReverseRow>
          <div>Reverse Row content</div>
        </BudgetBreakdownItem.ReverseRow>,
      )
      const reverseRowContainer = screen.getByTestId('reverseRowContainer')
      expect(reverseRowContainer).toHaveClass('flex-row-reverse')
    })
  })
})
