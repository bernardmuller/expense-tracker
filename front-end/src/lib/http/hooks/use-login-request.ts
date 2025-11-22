import { useMutation } from '@tanstack/react-query'
import { Result, ok } from 'neverthrow'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'

type LoginRequestBody =
  paths['/auth/login/request']['post']['requestBody']['content']['application/json']

type LoginRequestSuccess =
  paths['/auth/login/request']['post']['responses']['200']['content']['application/json']

type LoginRequestError =
  | paths['/auth/login/request']['post']['responses']['404']['content']['application/json']
  | paths['/auth/login/request']['post']['responses']['500']['content']['application/json']

export function useLoginRequest() {
  return useMutation({
    mutationKey: queryKeys.auth.login.request(),
    mutationFn: async (
      body: LoginRequestBody,
    ): Promise<Result<LoginRequestSuccess, LoginRequestError>> =>
      toResult(client.POST('/auth/login/request', { body }))
        .andThen((data) => {
          sessionStorage.setItem('token', data.token)
          return ok(data)
        })
        .mapErr((error) => {
          toast.error(error.message || 'Failed to send login request')
          return error
        }),
  })
}
