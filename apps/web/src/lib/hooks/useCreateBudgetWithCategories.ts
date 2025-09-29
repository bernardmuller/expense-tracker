import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'

export function useCreateBudgetWithCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      userId: string
      name: string
      startAmount: number
      categoryAllocations?: Record<string, number>
    }) => {
      const { createBudgetWithCategoriesRoute } = await import('../../server/routes/budgets/createBudgetWithCategoriesRoute')
      return createBudgetWithCategoriesRoute({ data })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeBudget(variables.userId),
      })
    },
  })
}