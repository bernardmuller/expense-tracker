import { useQuery } from '@tanstack/react-query'
import { getActiveBudget } from '../server/budgets'
import { queryKeys } from '../lib/query-client'

interface BudgetDisplayProps {
  userId: string
}

export default function BudgetDisplay({ userId }: BudgetDisplayProps) {
  const { data: budget, isLoading, error } = useQuery({
    queryKey: queryKeys.activeBudget(userId),
    queryFn: () => getActiveBudget({ data: { userId } }),
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <p className="text-red-800 dark:text-red-400">Error loading budget information</p>
      </div>
    )
  }

  if (!budget) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-400 mb-2">No Budget Found</h2>
        <p className="text-yellow-700 dark:text-yellow-300">Create your first budget to start tracking expenses!</p>
      </div>
    )
  }

  const startAmount = parseFloat(budget.startAmount)
  const currentAmount = parseFloat(budget.currentAmount)
  const spentAmount = startAmount - currentAmount
  const spentPercentage = startAmount > 0 ? (spentAmount / startAmount) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Monthly Budget</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{budget.name}</p>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          R{currentAmount.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          remaining of ${startAmount.toFixed(2)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Spent: R{spentAmount.toFixed(2)}</span>
          <span className="text-gray-600 dark:text-gray-400">{spentPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${spentPercentage > 90 ? 'bg-red-500 dark:bg-red-400' :
              spentPercentage > 75 ? 'bg-yellow-500 dark:bg-yellow-400' :
                'bg-green-500 dark:bg-green-400'
              }`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
