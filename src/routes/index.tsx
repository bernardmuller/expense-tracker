import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import BudgetDisplay from '../components/BudgetDisplay'
import RecentExpenses from '../components/RecentExpenses'
import AddExpenseForm from '../components/AddExpenseForm'
import StartNewBudgetModal from '../components/StartNewBudgetModal'
import AuthForm from '../components/AuthForm'
import { getActiveBudget } from '../server/budgets'
import { queryKeys } from '../lib/query-client'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  component: ExpenseTracker,
})

function ExpenseTracker() {
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      // Return null during SSR
      if (typeof window === 'undefined') {
        return null
      }
      return await authClient.getSession()
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleAuthSuccess = () => {
    // Refresh session data after successful auth
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }


  const userId = session?.data?.user.id

  const { data: budget, isLoading, error } = useQuery({
    queryKey: queryKeys.activeBudget(userId!),
    queryFn: () => getActiveBudget({ data: { userId } }),
  })

  // Show loading state while checking session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.data?.user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    )
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-end items-center mb-4">
            <button
              onClick={() => authClient.signOut()}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Sign out
            </button>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-2">Error Loading Data</h1>
            <p className="text-red-700 dark:text-red-300 mb-4">Unable to load your budget information.</p>
            <button
              onClick={() => setIsNewBudgetModalOpen(true)}
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Create Budget
            </button>
          </div>
        </div>
        <StartNewBudgetModal
          isOpen={isNewBudgetModalOpen}
          onClose={() => setIsNewBudgetModalOpen(false)}
          userId={userId!}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-end items-center mb-4">
            <button
              onClick={() => authClient.signOut()}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Sign out
            </button>
          </div>
          <div className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!budget) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={async () => {
                  await authClient.signOut()
                  queryClient.invalidateQueries({ queryKey: ['session'] })
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome{session.data.user.name ? `, ${session.data.user.name}` : ''}!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first budget to start tracking your expenses!</p>
              <button
                onClick={() => setIsNewBudgetModalOpen(true)}
                className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
        <StartNewBudgetModal
          isOpen={isNewBudgetModalOpen}
          onClose={() => setIsNewBudgetModalOpen(false)}
          userId={userId!}
        />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back{session.data.user.name ? `, ${session.data.user.name}` : ''}!
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewBudgetModalOpen(true)}
                className="text-sm bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded-md font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                New Budget
              </button>
              <button
                onClick={async () => {
                  await authClient.signOut()
                  queryClient.invalidateQueries({ queryKey: ['session'] })
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
          <BudgetDisplay userId={userId!} />
          <RecentExpenses budgetId={budget.id} />
          <AddExpenseForm budgetId={budget.id} userId={userId!} />
        </div>
      </div>
      <StartNewBudgetModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => setIsNewBudgetModalOpen(false)}
        userId={userId!}
        previousBudgetAmount={parseFloat(budget.startAmount)}
      />
    </>
  )
}
