import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Result } from 'neverthrow'
import { ok, err, ResultAsync } from 'neverthrow'
import { toast } from 'sonner'
import { client } from '../client'
import { queryKeys } from '../query-keys'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { withAccessToken } from '../with-token'

type DeleteRecurringExpenseError = {
  error: string
  message: string
  code: string
}

export function useDeleteRecurringExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: queryKeys.recurringExpenses.delete(),
    mutationFn: async (input: {
      templateId: string
    }): Promise<Result<{ id: string }, DeleteRecurringExpenseError>> =>
      withAccessToken(
        (ctx) =>
          ResultAsync.fromPromise(
            client.DELETE('/recurring-expenses/{templateId}', {
              params: { path: { templateId: input.templateId } },
              headers: {
                authorization: `Bearer ${ctx.token}`,
              },
            }),
            (e): DeleteRecurringExpenseError => ({
              error: 'NetworkError',
              message: String(e),
              code: 'NETWORK_ERROR',
            }),
          ).andThen(({ response, error: respError }) => {
            if (response.ok) {
              toast.success('Recurring expense deleted')
              const userIdResult = getUserIdFromAccessToken()
              if (userIdResult.isOk()) {
                queryClient.invalidateQueries({
                  queryKey: queryKeys.recurringExpenses.byUser(
                    userIdResult.value,
                  ),
                })
              }
              return ok({ id: input.templateId })
            }
            const errObj: DeleteRecurringExpenseError = respError
              ? (respError as DeleteRecurringExpenseError)
              : {
                  error: 'Error',
                  message: response.statusText,
                  code: String(response.status),
                }
            toast.error(
              errObj.message || 'Failed to delete recurring expense',
            )
            return err(errObj)
          }),
        (): DeleteRecurringExpenseError => ({
          error: 'Unauthorized',
          message: 'No access token found',
          code: 'MISSING_ACCESS_TOKEN',
        }),
      )().match(
        (data) => ok(data),
        (error) => err(error),
      ),
  })
}
