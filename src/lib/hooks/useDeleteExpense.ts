import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { expenseId: number }) => {
      const { deleteExpenseRoute } = await import('../../server/routes/expenses/deleteExpenseRoute')
      return deleteExpenseRoute({ data })
    },
    onSuccess: () => {
      // Invalidate all expense-related queries
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey
          return queryKey.includes('expenses') || queryKey.includes('budget')
        }
      })
    },
  })
}