import { err, ok } from 'neverthrow'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export function getAccessToken() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  return accessToken ? ok(accessToken) : err('No access token')
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  return refreshToken ? ok(refreshToken) : err('No refresh token')
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const hasTokens = () =>
  !!getAccessToken().isOk() && !!getRefreshToken().isOk()
