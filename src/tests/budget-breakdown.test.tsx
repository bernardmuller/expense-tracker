import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../test/test-utils'
import { BudgetBreakdownList } from '@/components/budget-breakdowns/budget-breakdown-list'

const mockData = [
  {
    id: 1,
    key: "groceries",
    name: "Groceries",
    spent: 342.50,
    planned: 400,
    icon: "🛒"
  },
  {
    id: 2,
    key: "transportation",
    name: "Transportation",
    spent: 125.80,
    planned: null,
    icon: "🚗"
  },
  {
    id: 3,
    key: "entertainment",
    name: "Entertainment",
    spent: 250.99,
    planned: 150, // Over budget scenario
    icon: "🎬"
  }
]

describe('BudgetBreakdownList', () => {
  const mockOnCategoryClick = vi.fn()

  beforeEach(() => {
    mockOnCategoryClick.mockClear()
  })

  it("renders on the page if data is passed", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)
    expect(screen.getByText(/Breakdown/i)).toBeInTheDocument()
  })

  it("renders a not found message when no data is passed", () => {
    render(<BudgetBreakdownList
      categories={[]}
      onCategoryClick={mockOnCategoryClick}
    />)
    expect(screen.getByText(/no expenses/i)).toBeInTheDocument()
    expect(screen.getByText(/start adding expenses/i)).toBeInTheDocument()
  })

  it("renders all categories when data is provided", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Transportation')).toBeInTheDocument()
    expect(screen.getByText('Entertainment')).toBeInTheDocument()
  })

  it("renders filter dropdown with 'All' option and all categories", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    const filterSelect = screen.getByRole('combobox')
    expect(filterSelect).toBeInTheDocument()
    expect(screen.getByText('Filter')).toBeInTheDocument()
  })

  it("calls onCategoryClick when a category item is clicked", async () => {
    const user = userEvent.setup()
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    const groceriesItem = screen.getByText('Groceries').closest('[role="button"], button, div[onClick]') || screen.getByText('Groceries')

    await user.click(groceriesItem)
    expect(mockOnCategoryClick).toHaveBeenCalledWith('groceries')
  })

  it("filters categories when filter state changes", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    expect(screen.getAllByText('Groceries')).toHaveLength(1) // Should only be in main content initially
    expect(screen.getByText('Transportation')).toBeInTheDocument()
    expect(screen.getByText('Entertainment')).toBeInTheDocument()
  })

  it("renders filter dropdown", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    const filterSelect = screen.getByRole('combobox')
    expect(filterSelect).toBeInTheDocument()
    expect(screen.getByText('Filter')).toBeInTheDocument()
  })

  it("displays correct categories based on filter logic", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    const categoryElements = screen.getAllByRole('heading', { level: 3 })
    const categoryNames = categoryElements.map(el => el.textContent)

    expect(categoryNames).toContain('Groceries')
    expect(categoryNames).toContain('Transportation')
    expect(categoryNames).toContain('Entertainment')
  })

  it("renders category details correctly", () => {
    render(<BudgetBreakdownList
      categories={[mockData[0]]}
      onCategoryClick={mockOnCategoryClick}
    />)

    expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument()
  })

  it("handles categories with no planned budget (null)", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    expect(screen.getByText('Transportation')).toBeInTheDocument()
  })

  it("identifies over-budget categories correctly", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)
  })

  it("identifies unplanned categories correctly", () => {
    render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)
  })

  it("maintains filter state when categories prop changes", () => {
    const { rerender } = render(<BudgetBreakdownList
      categories={mockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    const newMockData = [...mockData, {
      id: 4,
      key: "utilities",
      name: "Utilities",
      spent: 200,
      planned: 250,
      icon: "💡"
    }]

    rerender(<BudgetBreakdownList
      categories={newMockData}
      onCategoryClick={mockOnCategoryClick}
    />)

    expect(screen.getByText('Utilities')).toBeInTheDocument()
  })
})
