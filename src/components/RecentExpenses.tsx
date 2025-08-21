import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getRecentExpenses } from '../server/expenses'
import { queryKeys } from '../lib/query-client'
import { ExpenseCategory } from '../db/schema'

interface RecentExpensesProps {
  budgetId: string
}

const categoryIcons: Record<ExpenseCategory, string> = {
  food: '🍽️',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎮',
  utilities: '🏠',
  other: '💰',
}

const categoryLabels: Record<ExpenseCategory, string> = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  utilities: 'Utilities',
  other: 'Other',
}

export default function RecentExpenses({ budgetId }: RecentExpensesProps) {
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: queryKeys.recentExpenses(budgetId),
    queryFn: () => getRecentExpenses({ data: { budgetId } }),
    enabled: !!budgetId,
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <p className="text-red-800 dark:text-red-400">Error loading recent expenses</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Expenses</h2>
        <Link 
          to="/expenses" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          Show All
        </Link>
      </div>

      {!expenses || expenses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-600 dark:text-gray-400">No expenses yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Add your first expense below!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => {
            const category = expense.category as ExpenseCategory
            const icon = categoryIcons[category] || categoryIcons.other
            const label = categoryLabels[category] || 'Other'
            const amount = parseFloat(expense.amount)
            
            return (
              <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full text-lg">
                    {icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{expense.description}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{label}</div>
                  </div>
                </div>
                <div className="font-semibold text-red-600 dark:text-red-400">
                  -${amount.toFixed(2)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}