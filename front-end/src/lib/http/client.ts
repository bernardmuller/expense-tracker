import createClient from 'openapi-fetch'
import type { paths } from './schema'
import { err, ok, ResultAsync } from 'neverthrow'

const baseUrl = import.meta.env.VITE_API_URL

if (!baseUrl) {
  throw new Error('VITE_API_URL environment variable is not set')
}

export const client = createClient<paths>({
  baseUrl,
  credentials: 'include', // Include cookies for auth
})

client.use({
  async onRequest({ request }) {
    const token = sessionStorage.getItem('token')
    if (token && !request.headers.get('authorization')) {
      request.headers.set('authorization', `Bearer ${token}`)
    }
    return request
  },
})

export type ApiResponse<T> = T extends { data: infer D } ? D : never
export type ApiError<T> = T extends { error: infer E } ? E : never

export function toResult<T, E>(
  promise: Promise<{ data?: T; error?: E; response: Response }>,
): ResultAsync<T, E> {
  return ResultAsync.fromPromise(promise, (e) => e as E).andThen(
    ({ data, error }) => {
      if (error) return err(error)
      if (data !== undefined) return ok(data)
      return err(error as E)
    },
  )
}
