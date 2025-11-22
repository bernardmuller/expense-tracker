import { ResultAsync, errAsync } from 'neverthrow'
import { toast } from 'sonner'

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
      toast.error((error).message || 'No token found')
      return errAsync(error)
    }

    return fn({ token })
  }
}
