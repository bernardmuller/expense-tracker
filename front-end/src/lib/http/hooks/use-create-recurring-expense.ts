import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Result } from 'neverthrow'
import { ok, err, errAsync } from 'neverthrow'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import { withAccessToken } from '../with-token'

type CreateRecurringExpenseBody = NonNullable<
  paths['/users/{userId}/recurring-expenses']['post']['requestBody']
>['content']['application/json']

type CreateRecurringExpenseSuccess =
  paths['/users/{userId}/recurring-expenses']['post']['responses']['201']['content']['application/json']

type CreateRecurringExpenseError = {
  error: string
  message: string
  code: string
}

export function useCreateRecurringExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: queryKeys.recurringExpenses.create(),
    mutationFn: async (
      body: CreateRecurringExpenseBody,
    ): Promise<
      Result<CreateRecurringExpenseSuccess, CreateRecurringExpenseError>
    > =>
      withAccessToken(
        (ctx) => {
          const userIdResult = getUserIdFromAccessToken()

          if (userIdResult.isErr()) {
            toast.error('Unable to get user information')
            return errAsync({
              error: 'Unauthorized',
              message: 'Unable to get user information',
              code: 'MISSING_USER_ID',
            })
          }

          const userId = userIdResult.value

          return toResult(
            client.POST('/users/{userId}/recurring-expenses', {
              params: { path: { userId } },
              headers: {
                authorization: `Bearer ${ctx.token}`,
              },
              body,
            }),
          )
            .andThen((data) => {
              toast.success('Recurring expense created')
              queryClient.invalidateQueries({
                queryKey: queryKeys.recurringExpenses.byUser(userId),
              })
              return ok(data)
            })
            .mapErr((error) => {
              toast.error(
                error.message || 'Failed to create recurring expense',
              )
              return error
            })
        },
        (): CreateRecurringExpenseError => ({
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
