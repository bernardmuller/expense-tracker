import { toast } from 'sonner'
import { client, toResult } from '../../client'
import { queryKeys } from '../../query-keys'
import { withAccessToken } from '../../with-token'
import type { paths } from '../../schema'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'

type ChatsSuccess =
  paths['/chats']['get']['responses']['200']['content']['application/json']

type Chat = ChatsSuccess['chats'][number]

type ChatsError = {
  error: string
  message: string
  code: string
}

export async function fetchChatsByUser(userId: string): Promise<Chat | null> {
  const result = await withAccessToken(
    (ctx) => {
      return toResult(
        client.GET('/chats', {
          params: { query: { userId } },
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      )
    },
    (): ChatsError => ({
      error: 'Unauthorized',
      message: 'No access token found',
      code: 'MISSING_ACCESS_TOKEN',
    }),
  )()

  return result.match(
    (data) => data.chats[0] ?? null,
    (error) => {
      throw error
    },
  )
}

export function getChatsByUserQueryOptions(userId: string) {
  return {
    queryKey: queryKeys.chats.byUser(userId),
    queryFn: () => fetchChatsByUser(userId),
  }
}

export function getCurrentUserChatsQueryOptions() {
  const userIdResult = getUserIdFromAccessToken()

  if (userIdResult.isErr()) {
    toast.error('Unable to get user information')
    throw new Error('Unable to get user information')
  }

  return getChatsByUserQueryOptions(userIdResult.value)
}
