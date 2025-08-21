import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExpense } from '../server/expenses'
import { queryKeys } from '../lib/query-client'
import type { Budget, Expense, ExpenseCategory } from '../db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddExpenseFormProps {
  budgetId: string
  userId: string
}

const categoryOptions: Array<{ value: ExpenseCategory; label: string; icon: string }> = [
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
        (old: Array<Expense> | undefined) => {
          if (!old) return [optimisticExpense]
          return [optimisticExpense, ...old.slice(0, 4)]
        }
      )

      queryClient.setQueryData(
        queryKeys.allExpenses(budgetId),
        (old: Array<Expense> | undefined) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Expense name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={mutation.isPending}
          />

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            disabled={mutation.isPending}
          />

          <Select
            value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)} disabled={mutation.isPending}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                Add Expense
              </>
            )}
          </Button>
        </form>

        {mutation.error && (
          <div className="mt-4 p-3 bg-destructive/5 border border-destructive/50 rounded-md">
            <p className="text-destructive text-sm">
              Failed to add expense. Please try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
