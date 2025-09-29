import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { userId: string; name: string; startAmount: number }) => {
      const { createBudgetRoute } = await import('../../server/routes/budgets/createBudgetRoute')
      return createBudgetRoute({ data })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeBudget(variables.userId),
      })
    },
  })
}