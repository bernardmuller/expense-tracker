import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Result } from 'neverthrow'
import { ok, err } from 'neverthrow'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { withAccessToken } from '../with-token'

type UpdateRecurringExpenseBody = NonNullable<
  paths['/recurring-expenses/{templateId}']['patch']['requestBody']
>['content']['application/json']

type UpdateRecurringExpenseSuccess =
  paths['/recurring-expenses/{templateId}']['patch']['responses']['200']['content']['application/json']

type UpdateRecurringExpenseError = {
  error: string
  message: string
  code: string
}

export function useUpdateRecurringExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: queryKeys.recurringExpenses.update(),
    mutationFn: async (input: {
      templateId: string
      body: UpdateRecurringExpenseBody
    }): Promise<
      Result<UpdateRecurringExpenseSuccess, UpdateRecurringExpenseError>
    > =>
      withAccessToken(
        (ctx) =>
          toResult(
            client.PATCH('/recurring-expenses/{templateId}', {
              params: { path: { templateId: input.templateId } },
              headers: {
                authorization: `Bearer ${ctx.token}`,
              },
              body: input.body,
            }),
          )
            .andThen((data) => {
              toast.success('Recurring expense updated')
              const userIdResult = getUserIdFromAccessToken()
              if (userIdResult.isOk()) {
                queryClient.invalidateQueries({
                  queryKey: queryKeys.recurringExpenses.byUser(
                    userIdResult.value,
                  ),
                })
              }
              return ok(data)
            })
            .mapErr((error) => {
              toast.error(
                error.message || 'Failed to update recurring expense',
              )
              return error
            }),
        (): UpdateRecurringExpenseError => ({
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
