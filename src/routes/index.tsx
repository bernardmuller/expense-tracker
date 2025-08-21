import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import BudgetDisplay from '../components/BudgetDisplay'
import RecentExpenses from '../components/RecentExpenses'
import AddExpenseForm from '../components/AddExpenseForm'
import StartNewBudgetModal from '../components/StartNewBudgetModal'
import AuthForm from '../components/AuthForm'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSession, useActiveBudget } from '@/lib/hooks'

export const Route = createFileRoute('/')({
  component: ExpenseTracker,
})

function ExpenseTracker() {
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: session, isLoading: sessionLoading } = useSession()

  const handleAuthSuccess = () => {
    // Refresh session data after successful auth
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  const userId = session?.data?.user.id

  const { data: budget, isLoading, error } = useActiveBudget({ userId })

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
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
            <Button variant="ghost" size="sm" onClick={() => authClient.signOut()}>
              Sign out
            </Button>
          </div>
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-8 text-center bg-red-50 dark:bg-red-900/20">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-2">Error Loading Data</h1>
              <p className="text-red-700 dark:text-red-300 mb-4">Unable to load your budget information.</p>
              <Button onClick={() => setIsNewBudgetModalOpen(true)}>
                Create Budget
              </Button>
            </CardContent>
          </Card>
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
            <Button variant="ghost" size="sm" onClick={() => authClient.signOut()}>
              Sign out
            </Button>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await authClient.signOut()
                  queryClient.invalidateQueries({ queryKey: ['session'] })
                }}
              >
                Sign out
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h1 className="text-2xl font-bold mb-2">Welcome{session.data.user.name ? `, ${session.data.user.name}` : ''}!</h1>
                <p className="text-muted-foreground mb-6">Create your first budget to start tracking your expenses!</p>
                <Button onClick={() => setIsNewBudgetModalOpen(true)}>
                  Create Budget
                </Button>
              </CardContent>
            </Card>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await authClient.signOut()
                  queryClient.invalidateQueries({ queryKey: ['session'] })
                }}
              >
                Sign out
              </Button>
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
