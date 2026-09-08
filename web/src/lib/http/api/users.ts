import { client, toResult } from '../client'
import { withAccessToken } from '../with-token'

export const getUserById = (userId: string) =>
  withAccessToken(
    (ctx) =>
      toResult(
        client.GET('/users/{id}', {
          params: {
            path: { id: userId },
          },
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      ),
    () => ({
      error: 'Failed to get user',
      message: 'Failed to get user',
      code: 'REQUEST FAILED',
    }),
  )
