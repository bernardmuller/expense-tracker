import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ok, err } from 'neverthrow'
import type { Result } from 'neverthrow'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { withAccessToken } from '../with-token'

type CreateTransactionBody = NonNullable<
  paths['/budgets/{id}/transactions']['post']['requestBody']
>['content']['application/json']

type CreateTransactionSuccess =
  paths['/budgets/{id}/transactions']['post']['responses']['201']['content']['application/json']

type CreateTransactionError =
  | paths['/budgets/{id}/transactions']['post']['responses']['404']['content']['application/json']
  | paths['/budgets/{id}/transactions']['post']['responses']['422']['content']['application/json']
  | paths['/budgets/{id}/transactions']['post']['responses']['500']['content']['application/json']

export function useCreateTransaction(budgetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: queryKeys.transactions.create(),
    mutationFn: async (
      body: CreateTransactionBody,
    ): Promise<Result<CreateTransactionSuccess, CreateTransactionError>> => {
      return withAccessToken(
        (ctx) => {
          return toResult(
            client.POST('/budgets/{id}/transactions', {
              params: {
                path: { id: budgetId },
              },
              headers: {
                authorization: `Bearer ${ctx.token}`,
              },
              body,
            }),
          )
            .andThen((data) => {
              toast.success('Transaction created successfully!')
              return ok(data)
            })
            .mapErr((error) => {
              toast.error(error.message || 'Failed to create transaction')
              return error
            })
        },
        (): CreateTransactionError => ({
          error: 'Unauthorized',
          message: 'No access token found',
          code: 'MISSING_ACCESS_TOKEN',
        }),
      )().match(
        (data) => ok(data),
        (error) => err(error),
      )
    },
    onMutate: async (newTransaction) => {
      const userIdResult = getUserIdFromAccessToken()
      if (userIdResult.isErr()) return

      const userId = userIdResult.value
      const queryKey = queryKeys.budgets.active(userId)

      await queryClient.cancelQueries({ queryKey })

      const previousBudget = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old

        const currentAmount = parseFloat(old.currentAmount)
        const newAmount = currentAmount - newTransaction.amount

        const category = old.categories?.find(
          (cat: any) => cat.id === newTransaction.categoryId,
        )

        const optimisticTransaction = {
          id: `temp-${Date.now()}`,
          description: newTransaction.description,
          amount: newTransaction.amount.toString(),
          category: category || {
            id: newTransaction.categoryId,
            label: 'Unknown',
            icon: '💸',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          budgetId: old.id,
          categoryId: newTransaction.categoryId,
        }

        const updatedExpenses = [optimisticTransaction, ...(old.expenses || [])]

        return {
          ...old,
          currentAmount: newAmount.toString(),
          expenses: updatedExpenses,
        }
      })

      return { previousBudget, queryKey }
    },
    onError: (_err, _newTransaction, context) => {
      if (context?.previousBudget) {
        queryClient.setQueryData(context.queryKey, context.previousBudget)
      }
    },
    onSuccess: () => {
      const userIdResult = getUserIdFromAccessToken()
      if (userIdResult.isOk()) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.budgets.active(userIdResult.value),
        })
      }
    },
  })
}
