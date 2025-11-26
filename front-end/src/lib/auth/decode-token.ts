import { err, ok, type Result } from 'neverthrow'
import { getAccessToken } from './token-storage'

interface TokenPayload {
  userId: string
  email: string
  name: string
  iat: number
  exp: number
}

/**
 * Decodes a JWT token without verification (client-side)
 * Note: This only decodes the payload, it does NOT verify the signature
 */
function decodeJwt(token: string): Result<TokenPayload, string> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return err('Invalid token format')
    }

    const payload = parts[1]
    const decoded = JSON.parse(atob(payload)) as TokenPayload

    if (!decoded.userId || !decoded.email || !decoded.name) {
      return err('Invalid token payload: missing required fields')
    }

    return ok(decoded)
  } catch (error) {
    return err(`Failed to decode token: ${String(error)}`)
  }
}


export const getCurrentUser = (): Result<
  { userId: string; email: string; name: string },
  string
> =>
  getAccessToken().match(
    (token) =>
      decodeJwt(token).match(
        (res) =>
          ok({
            userId: res.userId,
            email: res.email,
            name: res.name,
          }),
        (error) => err(error),
      ),
    () => err('No access token found'),
  )

export const getUserIdFromAccessToken = (): Result<string, string> =>
  getCurrentUser().map((user) => user.userId)
