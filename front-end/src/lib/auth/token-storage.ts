import { err, ok } from 'neverthrow'
import * as dataStore from '../storage/data-store'
import { STORAGE_KEYS } from '../storage/storage-keys'

export function getAccessToken() {
	const accessToken = dataStore.getItem(STORAGE_KEYS.ACCESS_TOKEN)
	return accessToken ? ok(accessToken) : err('No access token')
}

export function setAccessToken(token: string): void {
	dataStore.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

export const getRefreshToken = () => {
	const refreshToken = dataStore.getItem(STORAGE_KEYS.REFRESH_TOKEN)
	return refreshToken ? ok(refreshToken) : err('No refresh token')
}

export function setRefreshToken(token: string): void {
	dataStore.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
}

export function setTokens(accessToken: string, refreshToken: string): void {
	setAccessToken(accessToken)
	setRefreshToken(refreshToken)
}

export function clearTokens(): void {
	dataStore.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
	dataStore.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export const hasTokens = () =>
	!!getAccessToken().isOk() && !!getRefreshToken().isOk()
