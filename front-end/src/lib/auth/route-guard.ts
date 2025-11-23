import { redirect } from '@tanstack/react-router'
import { hasTokens } from './token-storage'

export function requireAuth() {
  if (!hasTokens()) {
    throw redirect({
      to: '/login',
    })
  }
}
