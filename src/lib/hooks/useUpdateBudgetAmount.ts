import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useUpdateBudgetAmount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { budgetId: number; amount: number }) => {
      const { updateBudgetAmountRoute } = await import('../../server/routes/budgets/updateBudgetAmountRoute')
      return updateBudgetAmountRoute({ data })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgetById(variables.budgetId),
      })
    },
  })
}