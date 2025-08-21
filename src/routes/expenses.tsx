import { createFileRoute, Link } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ExpenseCategory, Expense } from '../db/schema'
import { deleteExpense } from '../server/expenses'
import StartNewBudgetModal from '../components/StartNewBudgetModal'
import AuthForm from '../components/AuthForm'
import AppLayout from '../components/AppLayout'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession, useActiveBudget, useAllExpenses } from '@/lib/hooks'
import { queryKeys } from '@/lib/query-client'
import { formatCurrency } from '@/lib/utils'

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
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: session, isLoading: sessionLoading } = useSession()

  const handleAuthSuccess = () => {
    // Refresh session data after successful auth
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }


  const userId = session?.data?.user.id

  const { data: budget } = useActiveBudget({ userId })

  const { data: expenses, isLoading, error } = useAllExpenses({ budgetId: budget?.id })

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onMutate: async (variables) => {
      // Skip optimistic updates during SSR
      if (typeof window === 'undefined') return
      
      const expenseId = variables.data.expenseId
      
      await queryClient.cancelQueries({ queryKey: queryKeys.recentExpenses(budget?.id || '') })
      await queryClient.cancelQueries({ queryKey: queryKeys.activeBudget(userId || '') })
      await queryClient.cancelQueries({ queryKey: queryKeys.allExpenses(budget?.id || '') })

      const previousRecentExpenses = queryClient.getQueryData(queryKeys.recentExpenses(budget?.id || ''))
      const previousBudget = queryClient.getQueryData(queryKeys.activeBudget(userId || ''))
      const previousAllExpenses = queryClient.getQueryData(queryKeys.allExpenses(budget?.id || ''))

      // Find the expense being deleted to get its amount
      const expenseToDelete = expenses?.find(e => e.id === expenseId)
      
      if (expenseToDelete) {
        // Optimistically remove from recent expenses
        queryClient.setQueryData(
          queryKeys.recentExpenses(budget?.id || ''),
          (old: any) => old?.filter((expense: any) => expense.id !== expenseId) || []
        )

        // Optimistically remove from all expenses
        queryClient.setQueryData(
          queryKeys.allExpenses(budget?.id || ''),
          (old: any) => old?.filter((expense: any) => expense.id !== expenseId) || []
        )

        // Optimistically update budget amount (add back the deleted expense amount)
        queryClient.setQueryData(
          queryKeys.activeBudget(userId || ''),
          (old: any) => {
            if (!old) return old
            const newCurrentAmount = parseFloat(old.currentAmount) + parseFloat(expenseToDelete.amount)
            return {
              ...old,
              currentAmount: newCurrentAmount.toString(),
              updatedAt: new Date(),
            }
          }
        )
      }

      return { previousRecentExpenses, previousBudget, previousAllExpenses }
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousRecentExpenses) {
        queryClient.setQueryData(queryKeys.recentExpenses(budget?.id || ''), context.previousRecentExpenses)
      }
      if (context?.previousBudget) {
        queryClient.setQueryData(queryKeys.activeBudget(userId || ''), context.previousBudget)
      }
      if (context?.previousAllExpenses) {
        queryClient.setQueryData(queryKeys.allExpenses(budget?.id || ''), context.previousAllExpenses)
      }
      console.error('Failed to delete expense:', err)
      setDeletingExpenseId(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recentExpenses(budget?.id || '') })
      queryClient.invalidateQueries({ queryKey: queryKeys.activeBudget(userId || '') })
      queryClient.invalidateQueries({ queryKey: queryKeys.allExpenses(budget?.id || '') })
      setDeletingExpenseId(null)
    }
  })

  const handleDeleteClick = (expenseId: string) => {
    setDeletingExpenseId(expenseId)
  }

  const handleConfirmDelete = (expenseId: string) => {
    console.log('Attempting to delete expense:', expenseId)
    deleteMutation.mutate({ data: { expenseId } })
  }

  const handleCancelDelete = () => {
    setDeletingExpenseId(null)
  }

  // Add click-away listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deletingExpenseId) {
        setDeletingExpenseId(null)
      }
    }

    if (deletingExpenseId) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [deletingExpenseId])

  if (sessionLoading) {
    return (
      <AppLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }

  if (!session?.data?.user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </AppLayout>
    )
  }


  if (!budget) {
    return (
      <AppLayout title="No Budget Found" showBackButton>
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
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="All Expenses"
      subtitle={budget.name}
      showBackButton
    >
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsNewBudgetModalOpen(true)}
          className="bg-chart-1 hover:bg-chart-1/90 text-sm"
        >
          Start New Budget
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Remaining</div>
              <div className="text-2xl font-bold text-primary">
                R{formatCurrency(parseFloat(budget.currentAmount))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Budget</div>
              <div className="text-lg font-semibold">
                R{formatCurrency(parseFloat(budget.startAmount))}
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
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-b-0 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div>
                      <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-destructive">Error loading expenses</p>
            </div>
          ) : !expenses || expenses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-muted-foreground mb-2">No expenses yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {expenses.map((expense) => {
                const category = expense.category as ExpenseCategory
                const icon = categoryIcons[category] || categoryIcons.other
                const label = categoryLabels[category] || 'Other'
                const amount = parseFloat(expense.amount)
                const date = new Date(expense.createdAt)

                return (
                  <div key={expense.id} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-foreground">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {label} • {date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold text-destructive">
                            R{formatCurrency(amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          {deleteMutation.isPending && deletingExpenseId === expense.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={true}
                              className="p-2 text-muted-foreground cursor-not-allowed"
                              aria-label="Deleting..."
                            >
                              ⏳
                            </Button>
                          ) : deletingExpenseId === expense.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleConfirmDelete(expense.id)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100"
                              aria-label="Confirm delete"
                            >
                              ✓
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(expense.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                              aria-label="Delete expense"
                            >❌
                            </Button>
                          )}
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

      <StartNewBudgetModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => setIsNewBudgetModalOpen(false)}
        userId={userId!}
        previousBudgetAmount={parseFloat(budget.startAmount)}
      />

    </AppLayout>
  )
}
