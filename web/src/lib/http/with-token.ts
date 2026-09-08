import { errAsync } from 'neverthrow'
import type { ResultAsync } from 'neverthrow'
import { toast } from 'sonner'
import * as dataStore from '../storage/data-store'
import { STORAGE_KEYS } from '../storage/storage-keys'

export type TokenContext = {
  token: string
}

export type ErrorWithMessage = {
  message: string
}

export function withToken<TSuccess, TError extends ErrorWithMessage>(
  fn: (context: TokenContext) => ResultAsync<TSuccess, TError>,
  createError: () => TError,
): () => ResultAsync<TSuccess, TError> {
  return (): ResultAsync<TSuccess, TError> => {
    const token = sessionStorage.getItem('token')

    if (!token) {
      const error = createError()
      toast.error(error.message || 'No token found')
      return errAsync(error)
    }

    return fn({ token })
  }
}

export function withAccessToken<TSuccess, TError extends ErrorWithMessage>(
  fn: (context: TokenContext) => ResultAsync<TSuccess, TError>,
  createError: () => TError,
): () => ResultAsync<TSuccess, TError> {
  return (): ResultAsync<TSuccess, TError> => {
    const token = dataStore.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (!token) {
      const error = createError()
      toast.error(error.message || 'No accessToken token found')
      return errAsync(error)
    }

    return fn({ token })
  }
}
