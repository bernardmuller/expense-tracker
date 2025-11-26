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

/**
 * Gets the current user's information from the access token
 */
export function getCurrentUser(): Result<
  { userId: string; email: string; name: string },
  string
> {
  return getAccessToken()
    .mapErr(() => 'No access token found')
    .andThen((token) => decodeJwt(token))
    .map((payload) => ({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    }))
}

/**
 * Gets the current user's ID from the access token
 */
export function getUserId(): Result<string, string> {
  return getCurrentUser().map((user) => user.userId)
}
