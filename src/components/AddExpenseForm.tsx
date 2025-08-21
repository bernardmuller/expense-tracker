import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExpense } from '../server/expenses'
import { queryKeys } from '../lib/query-client'
import { ExpenseCategory, Expense, Budget } from '../db/schema'

interface AddExpenseFormProps {
  budgetId: string
  userId: string
}

const categoryOptions: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { value: 'utilities', label: 'Utilities', icon: '🏠' },
  { value: 'other', label: 'Other', icon: '💰' },
]

export default function AddExpenseForm({ budgetId, userId }: AddExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory | ''>('')
  
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createExpense,
    onMutate: async (variables) => {
      // Skip optimistic updates during SSR
      if (typeof window === 'undefined') return
      
      await queryClient.cancelQueries({ queryKey: queryKeys.recentExpenses(budgetId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.activeBudget(userId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.allExpenses(budgetId) })

      const previousRecentExpenses = queryClient.getQueryData(queryKeys.recentExpenses(budgetId))
      const previousBudget = queryClient.getQueryData(queryKeys.activeBudget(userId))
      const previousAllExpenses = queryClient.getQueryData(queryKeys.allExpenses(budgetId))

      const optimisticExpense: Expense = {
        id: `temp-${Date.now()}`,
        budgetId: variables.data.budgetId,
        description: variables.data.description,
        amount: variables.data.amount.toString(),
        category: variables.data.category,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }

      queryClient.setQueryData(
        queryKeys.recentExpenses(budgetId),
        (old: Expense[] | undefined) => {
          if (!old) return [optimisticExpense]
          return [optimisticExpense, ...old.slice(0, 4)]
        }
      )

      queryClient.setQueryData(
        queryKeys.allExpenses(budgetId),
        (old: Expense[] | undefined) => {
          if (!old) return [optimisticExpense]
          return [optimisticExpense, ...old]
        }
      )

      queryClient.setQueryData(
        queryKeys.activeBudget(userId),
        (old: Budget | undefined | null) => {
          if (!old) return old
          const newCurrentAmount = parseFloat(old.currentAmount) - variables.data.amount
          return {
            ...old,
            currentAmount: newCurrentAmount.toString(),
            updatedAt: new Date(),
          }
        }
      )

      return { previousRecentExpenses, previousBudget, previousAllExpenses }
    },
    onError: (err, variables, context) => {
      if (context?.previousRecentExpenses) {
        queryClient.setQueryData(queryKeys.recentExpenses(budgetId), context.previousRecentExpenses)
      }
      if (context?.previousBudget) {
        queryClient.setQueryData(queryKeys.activeBudget(userId), context.previousBudget)
      }
      if (context?.previousAllExpenses) {
        queryClient.setQueryData(queryKeys.allExpenses(budgetId), context.previousAllExpenses)
      }
    },
    onSuccess: () => {
      setDescription('')
      setAmount('')
      setCategory('')
      
      queryClient.invalidateQueries({ queryKey: queryKeys.recentExpenses(budgetId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.activeBudget(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.allExpenses(budgetId) })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!description.trim() || !amount || !category) {
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    mutation.mutate({
      data: {
        budgetId,
        description: description.trim(),
        amount: amountNum,
        category,
      }
    })
  }

  const isSubmitDisabled = !description.trim() || !amount || !category || mutation.isPending

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Add Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Expense name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            disabled={mutation.isPending}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              disabled={mutation.isPending}
            >
              <option value="">Category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitDisabled
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
          }`}
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding...
            </div>
          ) : (
            <>
              ✓ Add Expense
            </>
          )}
        </button>
      </form>

      {mutation.error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-800 dark:text-red-400 text-sm">
            Failed to add expense. Please try again.
          </p>
        </div>
      )}
    </div>
  )
}