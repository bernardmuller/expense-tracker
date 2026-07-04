import { toast } from 'sonner'
import { client, toResult } from '../../client'
import { queryKeys } from '../../query-keys'
import { withAccessToken } from '../../with-token'
import type { paths } from '../../schema'

type NotificationPreferencesSuccess =
  paths['/notification-preferences/with-entity']['get']['responses']['200']['content']['application/json']

export type NotificationPreferenceWithEntity =
  NotificationPreferencesSuccess['notificationPreferences'][number]

type NotificationPreferencesError = {
  error: string
  message: string
  code: string
}

async function fetchNotificationPreferences(): Promise<
  NotificationPreferenceWithEntity[]
> {
  const result = await withAccessToken(
    (ctx) => {
      return toResult(
        client.GET('/notification-preferences/with-entity', {
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      )
    },
    (): NotificationPreferencesError => ({
      error: 'Unauthorized',
      message: 'No access token found',
      code: 'MISSING_ACCESS_TOKEN',
    }),
  )()

  return result.match(
    (data) => data.notificationPreferences,
    (error) => {
      toast.error(error.message || 'Failed to load notification preferences')
      throw error
    },
  )
}

export function getNotificationPreferencesQueryOptions() {
  return {
    queryKey: queryKeys.notificationPreferences.list(),
    queryFn: fetchNotificationPreferences,
  }
}
