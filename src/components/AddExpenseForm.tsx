import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/query-client'
import type { Budget, Expense, ExpenseCategory } from '../db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserActiveCategories } from '@/lib/hooks'

// Import server function with proper typing but without direct import
const createExpense = async (data: { budgetId: number; description: string; amount: number; category: string }) => {
  const { createExpense } = await import('../server/expenses')
  return createExpense({ data })
}

interface AddExpenseFormProps {
  defaultName: string
  defaultAmount: string
  budgetId: number
  userId: string
}

export default function AddExpenseForm({ budgetId, userId, defaultName, defaultAmount }: AddExpenseFormProps) {
  const [description, setDescription] = useState(defaultName)
  const [amount, setAmount] = useState(defaultAmount)
  const [category, setCategory] = useState<ExpenseCategory | ''>('')

  const queryClient = useQueryClient()
  const { data: userCategories, isLoading: categoriesLoading } = useUserActiveCategories(userId)

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
        id: -Date.now(), // Use negative number for temp ID to avoid conflicts
        budgetId: variables.budgetId,
        description: variables.description,
        amount: variables.amount.toString(),
        category: variables.category,
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
          const newCurrentAmount = parseFloat(old.currentAmount) - variables.amount
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
      budgetId,
      description: description.trim(),
      amount: amountNum,
      category,
    })
  }

  const isSubmitDisabled = !description.trim() || !amount || !category || mutation.isPending || categoriesLoading

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
            value={category}
            onValueChange={(value) => setCategory(value)}
            disabled={mutation.isPending || categoriesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Category"} />
            </SelectTrigger>
            <SelectContent>
              {userCategories?.map((category) => (
                <SelectItem key={category.id} value={category.key}>
                  {category.icon} {category.label}
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
