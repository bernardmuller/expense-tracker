import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from './useSession';
import type { Budget, Expense } from '@/db/schema'
import { queryKeys } from '@/lib/query-client'

const createExpense = async (data: { budgetId: number; description: string; amount: number; category: string }) => {
  const { createExpense } = await import('../../server/expenses')
  return createExpense({ data })
}

type CreateExpenseMutationParams = {
  budgetId: number
  onSuccess?: () => void
}

export default function useCreateExpense({ budgetId, onSuccess }: CreateExpenseMutationParams) {
  const queryClient = useQueryClient();
  const { data: session } = useSession()
  const userId = session?.data?.user.id
  return useMutation({
    mutationFn: createExpense,
    onMutate: async (variables) => {
      // Skip optimistic updates during SSR
      if (typeof window === 'undefined' || !userId) return

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
    // @ts-ignore: not used
    onError: (error, variables, context) => {
      if (context?.previousRecentExpenses) {
        queryClient.setQueryData(queryKeys.recentExpenses(budgetId), context.previousRecentExpenses)
      }
      if (context?.previousBudget) {
        queryClient.setQueryData(queryKeys.activeBudget(userId!), context.previousBudget)
      }
      if (context?.previousAllExpenses) {
        queryClient.setQueryData(queryKeys.allExpenses(budgetId), context.previousAllExpenses)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recentExpenses(budgetId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.activeBudget(userId!) })
      queryClient.invalidateQueries({ queryKey: queryKeys.allExpenses(budgetId) })

      if (onSuccess) {
        onSuccess()
      }
    },
  })

}
