import { useMutation } from '@tanstack/react-query'
import type { Result } from 'neverthrow'
import { toast } from 'sonner'
import { client, toResult } from '../client'
import { queryKeys } from '../query-keys'
import type { paths } from '../schema'

type OnboardSuccess =
  paths['/users/{id}/onboard']['patch']['responses']['200']['content']['application/json']

type OnboardError =
  | paths['/users/{id}/onboard']['patch']['responses']['409']['content']['application/json']
  | paths['/users/{id}/onboard']['patch']['responses']['404']['content']['application/json']

export function useOnboard() {
  return useMutation({
    mutationKey: queryKeys.users.onboard(),
    mutationFn: async (
      userId: string,
    ): Promise<Result<OnboardSuccess, OnboardError>> =>
      toResult(
        client.PATCH('/users/{id}/onboard', {
          params: { path: { id: userId } },
        })
      ).mapErr((error) => {
        toast.error(error.message || 'Failed to complete onboarding')
        return error
      }),
  })
}
