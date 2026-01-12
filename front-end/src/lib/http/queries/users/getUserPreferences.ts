import { toast } from 'sonner'
import { client, toResult } from '../../client'
import { queryKeys } from '../../query-keys'
import { withAccessToken } from '../../with-token'
import type { paths } from '../../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'

type UserPreferencesSuccess =
  paths['/users/{id}/preferences']['get']['responses']['200']['content']['application/json']

type UserPreferencesError = {
  error: string
  message: string
  code: string
}

export async function getUserPreferences(): Promise<UserPreferencesSuccess> {
  const userIdResult = getUserIdFromAccessToken()

  if (userIdResult.isErr()) {
    toast.error('Unable to get user information')
    throw new Error('Unable to get user information')
  }

  const userId = userIdResult.value

  const result = await withAccessToken(
    (ctx) => {
      return toResult(
        client.GET('/users/{id}/preferences', {
          params: {
            path: { id: userId },
          },
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      )
    },
    (): UserPreferencesError => ({
      error: 'Unauthorized',
      message: 'No access token found',
      code: 'MISSING_ACCESS_TOKEN',
    }),
  )()

  return result.match(
    (data) => data,
    (error) => {
      throw error
    },
  )
}

export function getUserPreferencesQueryOptions() {
  return {
    queryKey: queryKeys.users.preferences,
    queryFn: getUserPreferences,
  }
}
