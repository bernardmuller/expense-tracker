import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getAllExpenses } from '../server/expenses'
import { getActiveBudget } from '../server/budgets'
import { queryKeys } from '../lib/query-client'
import { ExpenseCategory } from '../db/schema'
import StartNewBudgetModal from '../components/StartNewBudgetModal'
import AuthForm from '../components/AuthForm'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/expenses')({
  component: ExpensesPage,
})

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

function ExpensesPage() {
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
  })

  const handleAuthSuccess = () => {
    // Refresh session data after successful auth
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }


  const userId = session?.data?.user.id

  const { data: budget } = useQuery({
    queryKey: queryKeys.activeBudget(userId!),
    queryFn: () => getActiveBudget({ data: { userId: userId! } }),
  })

  const { data: expenses, isLoading, error } = useQuery({
    queryKey: queryKeys.allExpenses(budget?.id || ''),
    queryFn: () => getAllExpenses({ data: { budgetId: budget!.id } }),
    enabled: !!budget?.id,
  })

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


  if (!budget) {
    return (
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
              <div className="text-6xl mb-4">📋</div>
              <h1 className="text-2xl font-bold mb-2">No Budget Found</h1>
              <p className="text-muted-foreground mb-6">Create a budget first to track your expenses!</p>
              <Button asChild>
                <Link to="/">
                  Go Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
        >
          ← Back
        </Link>
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">All Expenses</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{budget.name}</p>
          </div>
          <Button
            onClick={() => setIsNewBudgetModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-sm"
          >
            Start New Budget
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Remaining</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  R{parseFloat(budget.currentAmount).toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Budget</div>
                <div className="text-lg font-semibold">
                  R{parseFloat(budget.startAmount).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">

          {isLoading ? (
            <div className="p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-red-600 dark:text-red-400">Error loading expenses</p>
            </div>
          ) : !expenses || expenses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">No expenses yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {expenses.map((expense) => {
                const category = expense.category as ExpenseCategory
                const icon = categoryIcons[category] || categoryIcons.other
                const label = categoryLabels[category] || 'Other'
                const amount = parseFloat(expense.amount)
                const date = new Date(expense.createdAt)

                return (
                  <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full text-lg">
                          {icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{expense.description}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {label} • {date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600 dark:text-red-400">
                          -${amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          </CardContent>
        </Card>
      </div>

      <StartNewBudgetModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => setIsNewBudgetModalOpen(false)}
        userId={userId!}
        previousBudgetAmount={parseFloat(budget.startAmount)}
      />
    </div>
  )
}
