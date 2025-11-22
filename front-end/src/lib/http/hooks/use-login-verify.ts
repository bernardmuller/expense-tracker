import { useMutation } from '@tanstack/react-query'
import { Result, ok } from 'neverthrow'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { withToken } from '../with-token'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'

type LoginVerifyBody =
  paths['/auth/login/verify']['post']['requestBody']['content']['application/json']

type LoginVerifySuccess =
  paths['/auth/login/verify']['post']['responses']['200']['content']['application/json']

type LoginVerifyError =
  | paths['/auth/login/verify']['post']['responses']['401']['content']['application/json']
  | paths['/auth/login/verify']['post']['responses']['404']['content']['application/json']
  | paths['/auth/login/verify']['post']['responses']['500']['content']['application/json']

export function useLoginVerify() {
  return useMutation({
    mutationKey: queryKeys.auth.login.verify(
      sessionStorage.getItem('token') || '',
    ),
    mutationFn: async (
      body: LoginVerifyBody,
    ): Promise<Result<LoginVerifySuccess, LoginVerifyError>> =>
      withToken(
        (ctx) =>
          toResult(
            client.POST('/auth/login/verify', {
              params: {
                header: {
                  authorization: `Bearer ${ctx.token}`,
                },
              },
              body,
            }),
          )
            .andThen((data) => {
              sessionStorage.removeItem('token')
              return ok(data)
            })
            .mapErr((error) => {
              toast.error(error.message || 'Failed to verify login')
              return error
            }),
        (): LoginVerifyError => ({
          error: 'Unauthorized',
          message: 'No verification token found',
          code: 'MISSING_TOKEN',
        }),
      )(),
  })
}
