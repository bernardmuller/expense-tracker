import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../test/test-utils'
import type { RecentExpensesByBudgetId } from '@/server/queries/expenses'
import type { CategoriesByUserId } from '@/server/queries/categories'
import RecentExpenses from '@/components/expenses/RecentExpenses'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { getCategoryInfo } from '@/lib/category-utils'

const mockExpenses: RecentExpensesByBudgetId = [{
  id: 1,
  budgetId: 101,
  description: "Grocery shopping at Whole Foods",
  amount: "127.45",
  category: "groceries",
  createdAt: new Date("2024-09-10T14:30:00Z"),
  updatedAt: new Date("2024-09-10T14:30:00Z"),
  deletedAt: null
},
{
  id: 2,
  budgetId: 101,
  description: "Parking",
  amount: "65.20",
  category: "parking",
  createdAt: new Date("2024-09-11T09:15:00Z"),
  updatedAt: new Date("2024-09-11T09:15:00Z"),
  deletedAt: null
},
{
  id: 3,
  budgetId: 101,
  description: "Netflix monthly subscription",
  amount: "15.99",
  category: "entertainment",
  createdAt: new Date("2024-09-12T12:00:00Z"),
  updatedAt: new Date("2024-09-12T12:00:00Z"),
  deletedAt: null
},
{
  id: 4,
  budgetId: 101,
  description: "Coffee shop visit",
  amount: "8.75",
  category: "coffee",
  createdAt: new Date("2024-09-13T08:45:00Z"),
  updatedAt: new Date("2024-09-13T08:45:00Z"),
  deletedAt: null
},
{
  id: 5,
  budgetId: 101,
  description: "Movies",
  amount: "50",
  category: "entertainment",
  createdAt: new Date("2024-09-13T08:45:00Z"),
  updatedAt: new Date("2024-09-13T08:45:00Z"),
  deletedAt: null
},
{
  id: 6,
  budgetId: 101,
  description: "Electric bill payment",
  amount: "89.33",
  category: "utilities",
  createdAt: new Date("2024-09-14T16:20:00Z"),
  updatedAt: new Date("2024-09-14T16:20:00Z"),
  deletedAt: null
}]

const mockCategories: CategoriesByUserId = [
  {
    "id": 18,
    "key": "coffee",
    "label": "Coffee",
    "icon": "☕",
    "userId": "FFhVqTwX9MNQkxVhX1bWPLvcAx6iUkEC",
    "categoryId": 16,
    "createdAt": new Date("2025-08-27T06:11:11.462Z"),
    "updatedAt": new Date(),
    "deletedAt": null,
    "category": {
      "id": 16,
      "key": "coffee",
      "label": "Coffee",
      "icon": "☕",
      "createdAt": new Date("2025-08-26T20:45:29.548Z"),
      "updatedAt": new Date(),
      "deletedAt": null
    }
  },
  {
    "id": 4,
    "key": "entertainment",
    "label": "Entertainment",
    "icon": "🎮",
    "userId": "FFhVqTwX9MNQkxVhX1bWPLvcAx6iUkEC",
    "categoryId": 8,
    "createdAt": new Date("2025-08-26T20:58:28.720Z"),
    "updatedAt": new Date(),
    "deletedAt": null,
    "category": {
      "id": 8,
      "key": "entertainment",
      "label": "Entertainment",
      "icon": "🎮",
      "createdAt": new Date("2025-08-26T20:45:29.539Z"),
      "updatedAt": new Date(),
      "deletedAt": null
    }
  },
  {
    "id": 2,
    "key": "groceries",
    "label": "Groceries",
    "icon": "🛒",
    "userId": "FFhVqTwX9MNQkxVhX1bWPLvcAx6iUkEC",
    "categoryId": 2,
    "createdAt": new Date("2025-08-26T20:58:28.720Z"),
    "updatedAt": new Date(),
    "deletedAt": null,
    "category": {
      "id": 2,
      "key": "groceries",
      "label": "Groceries",
      "icon": "🛒",
      "createdAt": new Date("2025-08-26T20:45:29.531Z"),
      "updatedAt": new Date(),
      "deletedAt": null
    }
  },
  {
    "id": 23,
    "key": "parking",
    "label": "Parking",
    "icon": "🅿️",
    "userId": "FFhVqTwX9MNQkxVhX1bWPLvcAx6iUkEC",
    "categoryId": 22,
    "createdAt": new Date("2025-08-27T06:11:22.436Z"),
    "updatedAt": new Date(),
    "deletedAt": null,
    "category": {
      "id": 22,
      "key": "parking",
      "label": "Parking",
      "icon": "🅿️",
      "createdAt": new Date("2025-08-26T20:45:29.555Z"),
      "updatedAt": new Date(),
      "deletedAt": null
    }
  },
  {
    "id": 11,
    "key": "utilities",
    "label": "Utilities",
    "icon": "💡",
    "userId": "FFhVqTwX9MNQkxVhX1bWPLvcAx6iUkEC",
    "categoryId": 7,
    "createdAt": new Date("2025-08-27T06:11:03.271Z"),
    "updatedAt": new Date(),
    "deletedAt": null,
    "category": {
      "id": 7,
      "key": "utilities",
      "label": "Utilities",
      "icon": "💡",
      "createdAt": new Date("2025-08-26T20:45:29.538Z"),
      "updatedAt": new Date(),
      "deletedAt": null
    }
  }
]

const currencySymbols = [
  "$",
  "R",
  "€",
  "£",
  "¥"
]

describe('RecentExpenses', () => {
  it("renders on the page with a link to the expenses page", () => {
    render(<RecentExpenses
      currencySymbol='R'
      expenses={mockExpenses}
      categories={mockCategories}
    />);
    expect(screen.getByText(/recent/i)).toBeInTheDocument();

    const link = screen.getByText("View All");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("to", "/expenses");
  })

  it("renders no expenses when the array is empty", () => {
    render(<RecentExpenses
      currencySymbol='R'
      expenses={[]}
      categories={mockCategories}
    />);

    expect(screen.getByText(/no expenses/i)).toBeInTheDocument();
  })

  it("renders a list of expenses", () => {
    render(<RecentExpenses
      currencySymbol='R'
      expenses={mockExpenses}
      categories={mockCategories}
    />);

    mockExpenses.forEach(e => {
      expect(screen.getByText(e.description)).toBeInTheDocument();
      expect(screen.getByText(`R${formatCurrency(Number(e.amount))}`)).toBeInTheDocument();
    })
  })

  it("renders the correct currency symbol", () => {
    currencySymbols.forEach(s => {
      render(<RecentExpenses
        currencySymbol={s}
        expenses={mockExpenses}
        categories={mockCategories}
      />);

      mockExpenses.forEach(e => {
        expect(screen.getByText(`${s}${formatCurrency(Number(e.amount))}`)).toBeInTheDocument();
      })
    })
  })

  it("throws an error when no currency symbol is provided", () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    expect(() => {
      render(
        <RecentExpenses
          // @ts-ignore: testing undefined
          currencySymbol={undefined}
          expenses={[]}
          categories={[]}
        />
      )
    }).toThrow();
    consoleSpy.mockRestore();
  })

  it("renders a list of expenses with category icons if the category array is provided", () => {
    render(<RecentExpenses
      currencySymbol='R'
      expenses={mockExpenses}
      categories={mockCategories}
    />);

    mockExpenses.forEach(e => {
      const icon = getCategoryInfo(e.category, mockCategories).icon;
      expect(screen.getAllByText(`${icon}`)[0]).toBeInTheDocument();
    })
  })

  it("renders a list of expenses without any icons if the category array is not provided", () => {
    render(<RecentExpenses
      currencySymbol='R'
      expenses={mockExpenses}
      categories={[]}
    />);

    mockExpenses.forEach(e => {
      const categoryIcon = getCategoryInfo(e.category, []).icon;
      expect(categoryIcon).toBeNull();
      expect(categoryIcon).not.toBeInTheDocument();
    })
  })
})

