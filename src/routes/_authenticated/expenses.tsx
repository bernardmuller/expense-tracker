import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import z from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import StartNewBudgetModal from '../components/StartNewBudgetModal'
import AppLayout from '../../components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSession, useActiveBudget, useAllExpenses, useAllCategories } from '@/lib/hooks'

import { queryKeys } from '@/lib/query-client'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { cn } from '@/lib/utils/cn'
import { getCategoryInfo } from '@/lib/category-utils'
import { Trash, Trash2 } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { defaultCategories } from '@/lib/constants/default-categories'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useDeleteExpense } from '@/lib/hooks/useDeleteExpense'

const routeSearchSchema = z.object({
  filter: z.string().optional()
})

export const Route = createFileRoute('/_authenticated/expenses')({
  component: ExpensesPage,
  validateSearch: routeSearchSchema
})

function ExpensesPage() {
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false)
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null)
  const [tooltipExpenseId, setTooltipExpenseId] = useState<number | null>(null)
  const queryClient = useQueryClient()
  const { filter } = Route.useSearch()
  const [filteredCategogry, setFilteredCategory] = useState<string | null>(filter ?? null)

  const { data: session } = useSession()
  const userId = session?.data?.user.id
  const { data: allCategories } = useAllCategories()
  const { data: budget } = useActiveBudget({ userId })
  const { data: expenses, isLoading, error } = useAllExpenses({ budgetId: budget?.id })

  const filteredExpenses = useMemo(() => {
    if (filteredCategogry === "all" || !filteredCategogry) return expenses;
    if (expenses) {
      return expenses.filter(e => e.category === filteredCategogry)
    }
  }, [filteredCategogry, expenses])


  const deleteMutation = useDeleteExpense()

  // Override the mutation with custom optimistic update logic
  const deleteMutationWithOptimistic = useMutation({
    mutationFn: async (data: { expenseId: number }) => {
      const { deleteExpenseRoute } = await import('../server/routes/expenses/deleteExpenseRoute')
      return deleteExpenseRoute({ data })
    },
    onMutate: async (variables) => {
      // Skip optimistic updates during SSR
      if (typeof window === 'undefined') return

      const expenseId = variables.expenseId

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
    onError: (err, _, context) => {
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

  const handleDeleteClick = (expenseId: number) => {
    setDeletingExpenseId(expenseId)
    setTooltipExpenseId(expenseId)
  }

  const handleConfirmDelete = (expenseId: number) => {
    console.log('Attempting to delete expense:', expenseId)
    setDeletingExpenseId(expenseId)
    setTooltipExpenseId(null)
    deleteMutationWithOptimistic.mutate({ expenseId })
  }


  // Add click-away listener
  useEffect(() => {
    const handleClickOutside = () => {
      if (deletingExpenseId) {
        setDeletingExpenseId(null)
      }
      if (tooltipExpenseId) {
        setTooltipExpenseId(null)
      }
    }

    if (deletingExpenseId || tooltipExpenseId) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [deletingExpenseId, tooltipExpenseId])



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
      <div className="pb-3 flex justify-between items-center">
        <h3 className="text-lg text-muted-foreground">
          Expense History
        </h3>
        <div>
          <Select value={filteredCategogry ?? "all"} onValueChange={(value) => setFilteredCategory(value)}>
            <SelectTrigger className={cn({ 'w-[90px]': filteredCategogry === null })}>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {[{ key: 'all', label: "All", icon: "" }, ...defaultCategories].map(c =>
                <SelectItem value={c.key}>{c.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className='gap-1 pb-3 pt-0 pb-0'>
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
              {filteredExpenses?.length !== 0 ? (<>{filteredExpenses?.map((expense) => {
                const categoryInfo = getCategoryInfo(expense.category, allCategories)
                const amount = parseFloat(expense.amount)
                const date = new Date(expense.createdAt)

                return (
                  <div key={expense.id} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-foreground">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {categoryInfo.label}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            R{formatCurrency(amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(date, "d LLL yyyy")}
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          {deleteMutationWithOptimistic.isPending && deletingExpenseId === expense.id ? (
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
                            <Tooltip open={tooltipExpenseId === expense.id}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleConfirmDelete(expense.id)}
                                  className="p-2 text-green-600 hover:text-green-700 bg-green-200 transition-all duration-200 ease-in-out"
                                  aria-label="Confirm delete"
                                >
                                  <Trash2 />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="left"
                                className='p-2.5'
                              >
                                You sure?
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(expense.id)}
                              className="p-0 text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-200 ease-in-out"
                              aria-label="Delete expense"
                            >
                              <Trash />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}</>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-muted-foreground mb-2">No expenses found {filteredCategogry ? ' in this category' : ''}</p>
                </div>
              )}
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
